package io.github.theprez.userprovision;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class HttpRequestor {

    private static Map<String, String> arrayToMap(final String[] _arr) {
        final Map<String, String> ret = new LinkedHashMap<String, String>();
        for (int i = 0; (1 + i) < _arr.length; i += 2) {
            ret.put(_arr[i], _arr[1 + i]);
        }
        return ret;
    }

    private final OkHttpClient m_client;

    public HttpRequestor() {
        m_client = new OkHttpClient();
    }

    public int delete(final boolean _assert200, final String _url, final Map<String, String> _headers) throws IOException {
        final Headers headers = Headers.of(_headers);
        final Request request = new Request.Builder().url(_url).headers(headers).delete().build();

        final Call call = m_client.newCall(request);
        try (Response response = call.execute()) {
            final int responseCode = response.code();
            if (_assert200 && (responseCode < 200 || responseCode > 299)) {
                throw new IOException("HTTP response code was " + responseCode + " (" + response.message() + "): " + response.body().string());
            }
            return responseCode;
        }
    }

    public int delete(final boolean _assert200, final String _url, final String... _headers) throws IOException {
        return delete(_assert200, _url, arrayToMap(_headers));
    }

    public int post(final boolean _assert200, final String _url, final String _body, final Map<String, String> _headers) throws IOException {
        final Headers headers = Headers.of(_headers);
        final Request request = new Request.Builder().url(_url).headers(headers).post(RequestBody.create(_body.getBytes("UTF-8"))).build();

        final Call call = m_client.newCall(request);
        try (Response response = call.execute()) {
            final int responseCode = response.code();
            if (_assert200 && (responseCode < 200 || responseCode > 299)) {
                throw new IOException("HTTP response code was " + responseCode + " (" + response.message() + "): " + response.body().string());
            }
            return responseCode;
        }
    }

    public int post(final boolean _assert200, final String _url, final String _body, final String... _headers) throws IOException {
        return post(_assert200, _url, _body, arrayToMap(_headers));
    }
}
