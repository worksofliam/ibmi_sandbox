FROM ibm-semeru-runtimes:open-11-jdk-centos7

ENV DOWNLOAD=/opt/download
ENV WILDFLY=/opt/wildfly
ENV MAVEN=/opt/maven
ENV BLDDIR=/opt/app

# create dirs
RUN mkdir -p $DOWNLOAD
RUN mkdir -p $MAVEN
RUN mkdir -p $WILDFLY
RUN mkdir -p $BLDDIR
RUN mkdir -p /app


# install requisites
#RUN yum install -y wget maven

# download and install WildFly and Maven
WORKDIR ${DOWNLOAD}
RUN curl -L  https://dlcdn.apache.org/maven/maven-3/3.9.2/binaries/apache-maven-3.9.2-bin.tar.gz -o maven.tar.gz
RUN tar --strip-components=1 -C $MAVEN -xzvf maven.tar.gz
RUN curl -L https://github.com/wildfly/wildfly/releases/download/28.0.1.Final/wildfly-28.0.1.Final.tar.gz -o wildfly.tar.gz
RUN tar --strip-components=1 -C $WILDFLY -xzvf wildfly.tar.gz

# disable default welcome content (served at '/')
WORKDIR ${WILDFLY}/bin
RUN sed -i 's|^.*welcome-content.*$||g' ${WILDFLY}/standalone/configuration/standalone*.xml

# Create a default management user
#RUN ./add-user.sh -u 'jingle' -p 'jangle'

# copy in our source
COPY . ${BLDDIR}

# build the web application and install into WildFly
WORKDIR ${BLDDIR}
RUN rm -r target && ${MAVEN}/bin/mvn package
RUN mv target/*.war $WILDFLY/standalone/deployments

# Prep the /app directory and final command, and do some clean up
RUN mv .env /app
WORKDIR /app
RUN rm -r ${BLDDIR} ${MAVEN} ${DOWNLOAD}
CMD pwd && sleep 5 && ${WILDFLY}/bin/standalone.sh -Djboss.http.port=80 -Djboss.https.port=443 -b 0.0.0.0 -bmanagement 0.0.0.0