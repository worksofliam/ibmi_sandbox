package io.github.theprez.userprovision;

import java.util.LinkedHashSet;
import java.util.Set;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("/")
public class ProvisionUserAPI extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        System.out.println("WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
        final Set<Class<?>> ret = new LinkedHashSet<Class<?>>();
        ret.add(ProvisionUserAction.class);
        return ret;
    }
}
