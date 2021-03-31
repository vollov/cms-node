mkdir -p /docker/mongo
mkdir -p /docker/redis/data
mkdir -p /docker/redis/run
mkdir -p /docker/redis/logs
mkdir -p /docker/redis/etc
cp redis.conf /docker/redis/etc/
chown -R dustin.docker /docker/redis