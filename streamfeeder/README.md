# webdav photo previewer

browses a webdav endpoint configured in .env, and ... 
lets you mark files as "allowed to publish"
regenerates static files based on all the "allowed to publish" files from the endpoint

ie, the goal is providing a "review station" to a NextCloud "InstantUpload" folder, and making "sanitized/filtered" output static public websites of the stream...


```
VITE_SF_DAV_ENDPOINT=https://nextcloud.example.org/remote.php/dav/files/username
VITE_SF_DAV_USERNAME=username
VITE_SF_DAV_PASSWORD=blahblahblah # get an app password!
```

# relevant issues
https://github.com/nextcloud/server/issues/3131

