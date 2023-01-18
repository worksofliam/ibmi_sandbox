package io.github.theprez.userprovision;

import java.beans.PropertyVetoException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import com.github.theprez.jcmdutils.StringUtils;
import com.ibm.as400.access.AS400;
import com.ibm.as400.access.AS400JDBCDataSource;
import com.ibm.as400.access.AS400Message;
import com.ibm.as400.access.AS400SecurityException;
import com.ibm.as400.access.CommandCall;
import com.ibm.as400.access.ErrorCompletingRequestException;
import com.ibm.as400.access.IFSFile;
import com.ibm.as400.access.IFSFileOutputStream;
import com.ibm.as400.access.ObjectDoesNotExistException;
import com.ibm.as400.access.User;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;

@Path("/api")
public class ProvisionUserAction {
    private static final int BASE_USER_PORT_NUM = 16000;
    private static String USRPRF_PREFIX = "SNDBX";

    private static void createOrDeleteGHBranch(final Map<String, Object> _resultsMap, final AS400 _as400, final String _branch, final boolean _isCreate) throws IOException {

        final String sha = IBMiDotEnv.getDotEnv().get("SANDBOX_SHA", "3586a15cba3158bfc12219f188784f06f4f1c4ac");
        final String token = IBMiDotEnv.getDotEnv().get("SANDBOX_TOKEN");
        if (StringUtils.isEmpty(token)) {
            err("GitHub token not configured");
        }
        try {
            if (_isCreate) {
                final String body = String.format("{\"ref\": \"refs/heads/%s\",\"sha\": \"%s\"}", _branch, sha);
                final String url = "https://api.github.com/repos/worksofliam/ibmi_sandbox/git/refs";
                new HttpRequestor().post(true, url, body, "Authorization", "token " + token);
            } else {
                final String url = String.format("https://api.github.com/repos/worksofliam/ibmi_sandbox/git/refs/heads/%s", _branch);
                new HttpRequestor().delete(true, url, "Authorization", "token " + token);
            }
            _resultsMap.put("branch", _branch);
            _resultsMap.put("gh_success", true);
        }catch(IOException e) {
            _resultsMap.put("gh_success", false);
            _resultsMap.put("gh_response", e.getMessage());
        }
    }

    private static synchronized Map<String, Object> createUser(final AS400 _as400, final String _email, final String _host) throws Exception {
        final LinkedHashMap<String, Object> ret = new LinkedHashMap<String, Object>();
        final String user = getUser(_as400);
        ret.put("hostname", _host);
        ret.put("usrprf", user);
        final String desc = StringUtils.isNonEmpty(_email) ? _email : "Anonymous coward";
        ret.put("description", desc);
        final String homeDir = "/home/" + user.toUpperCase().trim();
        ret.put("home_dir", homeDir);
        final String password = getPassword(_as400, user);
        ret.put("password", password);
        final String command = String.format("QSYS/CRTUSRPRF USRPRF(%s) PASSWORD('%s') TEXT('%s') HOMEDIR('%s') PWDEXPITV(*NOMAX) CURLIB(%s)", user, password, desc, homeDir, user);
        runCmd(_as400, command);
        final AS400 userConnection = new AS400(_as400.getSystemName(), user, password);
        try {
            final IFSFile homeDirFile = new IFSFile(userConnection, homeDir);
            homeDirFile.mkdirs();
            if (!homeDirFile.isDirectory()) {
                err("Can't create home directory " + homeDir);
            }
            final AS400JDBCDataSource ds = new AS400JDBCDataSource(userConnection);
            try (Connection conn = ds.getConnection()) {
                final Statement stmt = conn.createStatement();
                stmt.execute("Create schema " + user); // TODO: solve the CPA7025 problem better (currently requires reply list entries)
                conn.commit();

                final IFSFile bash = new IFSFile(userConnection, "/QOpenSys/pkgs/bin/bash");
                if (bash.canExecute()) {
                    stmt.execute("CALL QSYS2.SET_PASE_SHELL_INFO('*CURRENT','/QOpenSys/pkgs/bin/bash')");
                    ret.put("shell", bash.getAbsolutePath());
                } else {
                    ret.put("shell", "/QOpenSys/usr/bin/sh");
                }
                final IFSFile dotProfile = new IFSFile(homeDirFile, ".profile");
                final IFSFileOutputStream dotProfileStream = new IFSFileOutputStream(dotProfile);
                try (OutputStreamWriter dotProfileWriter = new OutputStreamWriter(dotProfileStream, "UTF-8")) {
                    writeEnvVarToDotProfile(dotProfileWriter, "PATH", "/QOpenSys/pkgs/lib/nodejs18/bin:/QOpenSys/pkgs/bin:$PATH");
                    final int port = BASE_USER_PORT_NUM + Integer.valueOf(user.replaceAll("[^0-9]", ""));
                    writeEnvVarToDotProfile(dotProfileWriter, "PORT", "" + port);
                    writeEnvVarToDotProfile(dotProfileWriter, "APP_HOSTNAME", "" + _host);
                }
                dotProfile.setCCSID(1208);

                final IFSFile samplesDir = new IFSFile(homeDirFile, "samples");
                samplesDir.mkdir();
                final List<IFSFile> setupFiles = populateDirectoryFromGit("boilerplate", "boilerplate/stmf", samplesDir);
                for (final IFSFile setupFile : setupFiles) {
                    runSetupFile(setupFile, user);
                }
            }

            final String branch = _host + "/" + user;
            createOrDeleteGHBranch(ret, _as400, branch, true);
            return ret;
        } catch (final Exception createUserException) {
            try {
                new ProvisionUserAction().purgeUserProfile(_host, user);
            } catch (final Exception deleteUserException) {
                deleteUserException.printStackTrace();
            }
            throw createUserException;
        } finally {
            userConnection.disconnectAllServices();
        }
    }

    private static void err(final String _str) {
        throw new RuntimeException(_str);
    }

    private static String getPassword(final AS400 as400, final String user) {
        return user.toUpperCase();
        // return UUID.randomUUID().toString().replace("-", "").substring(0, 9);
    }

    private static synchronized String getUser(final AS400 as400) throws AS400SecurityException, ErrorCompletingRequestException, InterruptedException, IOException, ObjectDoesNotExistException {
        for (int i = 1; true; ++i) {
            final String nameTry = USRPRF_PREFIX + i;
            if (10 < nameTry.length()) {
                err("User profiles exhausted");
            }
            final User user = new User(as400, nameTry);
            if (!user.exists()) {
                return nameTry;
            }
        }
    }

    private static List<IFSFile> populateDirectoryFromGit(final String _branch, final String _gitPath, final IFSFile _targetDir) throws MalformedURLException, IOException, AS400SecurityException {
        final String gitZipUrl = String.format("https://github.com/worksofliam/ibmi_sandbox/archive/refs/heads/%s.zip", _branch);
        final List<IFSFile> ret = new LinkedList<IFSFile>();
        try (ZipInputStream zis = new ZipInputStream(new URL(gitZipUrl).openStream())) {
            ZipEntry entry = null;
            while (null != (entry = zis.getNextEntry())) {
                final String entryName = entry.getName().replaceFirst("^[^/]+/", "");
                if (!entryName.startsWith(_gitPath)) {
                    continue;
                }
                final String targetName = entryName.replaceFirst("^boilerplate/stmf/", "");
                if (entry.isDirectory()) {
                    final IFSFile dirFile = new IFSFile(_targetDir, targetName);
                    dirFile.mkdirs();
                    final boolean isMkdirSuccess = dirFile.isDirectory();
                    if (!isMkdirSuccess) {
                        throw new IOException("Couldn't make directory " + dirFile.getAbsolutePath());
                    }
                    continue;
                }
                final IFSFile targetFile = new IFSFile(_targetDir, targetName);
                try (IFSFileOutputStream out = new IFSFileOutputStream(targetFile)) {
                    streamXfer(zis, out);
                }
                targetFile.setCCSID(1208);
                if (entryName.contains("stmf/setup/")) {
                    ret.add(targetFile);
                }
            }
        }
        return ret;
    }

    private static void runCmd(final AS400 _as400, final String _command) throws AS400SecurityException, ErrorCompletingRequestException, IOException, InterruptedException, PropertyVetoException {
        final CommandCall cmd = new CommandCall(_as400, _command);
        final boolean isSuccess = cmd.run();

        // Show the messages (returned whether or not there was an error.)
        final AS400Message[] messagelist = cmd.getMessageList();
        String messages = "";
        for (final AS400Message msg : messagelist) {
            messages += msg;
            messages += "\n";
        }
        if (!isSuccess) {
            throw new IOException("Failed to run command: " + messages);
        }
    }

    private static void runSetupFile(final IFSFile _setupFile, final String _library) throws AS400SecurityException, ErrorCompletingRequestException, IOException, InterruptedException, PropertyVetoException {
        final String fileExtension = _setupFile.getAbsolutePath().replaceAll(".*\\.", "");
        switch (fileExtension.toLowerCase()) {
            case "sql":
                final String clCommand = String.format("RUNSQLSTM SRCSTMF('%s') COMMIT(*NONE) DFTRDBCOL(%s)", _setupFile.getAbsolutePath(), _library);
                runCmd(_setupFile.getSystem(), clCommand);
                _setupFile.delete();
                _setupFile.getParentFile().delete();
                break;
            default:
                System.err.println("Do not know how to run setup file " + _setupFile.getAbsolutePath());
        }
    }

    private static void streamXfer(final InputStream _in, final OutputStream _out) throws IOException {
        final byte[] buffer = new byte[1024];
        int bytesRead = -1;
        while (0 < (bytesRead = _in.read(buffer))) {
            _out.write(buffer, 0, bytesRead);
        }
    }

    private static void writeEnvVarToDotProfile(final OutputStreamWriter _dotProfileWriter, final String _envvar, final String _val) throws IOException {
        _dotProfileWriter.write("\n");
        _dotProfileWriter.write(_envvar + "=" + _val + "\n");
        _dotProfileWriter.write("export " + _envvar + "\n");
    }

    @GET
    @Path("/create")
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUserProfile(@HeaderParam("Host") final String _host, @QueryParam("email") final String _email) throws Exception {
        final AS400 as400 = IBMiDotEnv.getNewSystemConnection(true);
        as400.setGuiAvailable(false);
        try {
            if (StringUtils.isEmpty(_host)) {
                err("Could not determine host");
            }
            final String host = _host.startsWith("localhost") || _host.startsWith("127.0.0.1") ? as400.getSystemName() : _host.replaceAll(":.*", "");
            final Map<String, Object> ret = createUser(as400, _email, host);

            final ResponseBuilder resp = Response.ok(ret);
            resp.header("Access-Control-Allow-Origin", "*");
            return resp.build();
        } finally {
            as400.disconnectAllServices();
        }
    }

    @GET
    @Path("/purgemany")
    @Produces(MediaType.APPLICATION_JSON)
    public Response purgeMany(@HeaderParam("Host") final String _host, @QueryParam("upto") final String _upto) throws Exception {
        int upto = 200;
        if (StringUtils.isNonEmpty(_upto)) {
            upto = Integer.valueOf(_upto);
        }
        String body = "";
        for (int i = 0; i <= upto; ++i) {
            try{
                final Response r = purgeUserProfile(_host, USRPRF_PREFIX + i);
                body += r.getEntity() + "\n";
            }catch(Exception e) {
                body += "\n"+e.getClass()+": "+e.getMessage()+"\n";
            }
        }
        final ResponseBuilder resp = Response.ok(body);
        resp.header("Access-Control-Allow-Origin", "*");
        return resp.build();
    }

    @GET
    @Path("/purge")
    @Produces(MediaType.APPLICATION_JSON)
    public Response purgeUserProfile(@HeaderParam("Host") final String _host, @QueryParam("usrprf") final String _usrprf) throws Exception {
        if (StringUtils.isEmpty(_usrprf)) {
            err("User profile not specified");
        }
        if (StringUtils.isEmpty(_host)) {
            err("Could not determine host");
        }
        final AS400 as400 = IBMiDotEnv.getNewSystemConnection(true);
        final String host = _host.startsWith("localhost") || _host.startsWith("127.0.0.1") ? as400.getSystemName() : _host.replaceAll(":.*", "");
        final Map<String, Object> ret = new LinkedHashMap<String, Object>();
        try {
            final String usrprf = _usrprf.trim().toUpperCase();
            if (!usrprf.startsWith(USRPRF_PREFIX)) {
                err("This user profile is not allowed to be deleted");
            }
            final String branch = host + "/" + usrprf;
            runCmdWithErrorCheck(ret, as400, "DLTUSRPRF USRPRF(" + usrprf + ") OWNOBJOPT(*DLT)");
            createOrDeleteGHBranch(ret, as400, branch, false);
        } finally {
            as400.disconnectAllServices();
        }
        final ResponseBuilder resp = Response.ok(ret);
        resp.header("Access-Control-Allow-Origin", "*");
        return resp.build();
    }

    @GET
    @Path("/reset")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> resetUserProfile(@QueryParam("usrprf") final String _base, @QueryParam("email") final String _email) throws Exception {
        // TODO: implement this method
        return null;
    }

    private boolean runCmdWithErrorCheck(final Map<String, Object> _resultsMap, final AS400 _as400, final String _cmd) {
        final String shortForm = _cmd.trim().toLowerCase().replaceAll("\\s.*", "");
        try {
            runCmd(_as400, _cmd);
            _resultsMap.put(shortForm + "_success", true);
            return true;
        } catch (final Exception e) {
            _resultsMap.put(shortForm + "_success", false);
            _resultsMap.put(shortForm + "_exception", e.getMessage());
            return false;
        }

    }
}
