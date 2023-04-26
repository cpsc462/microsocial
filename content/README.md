# Content Service
Sync your fork on github and let's work on this later.

# How to run
1. Go to your github repository and sync fork
2. Clone your new fork if haven't or if you already cloned it before cd into it and run
   
```
git pull
```

3. Install dependencies
   
```
npm install
```

4. cd into content
   
```
cd content
```

5. Run your service

```
npm run dev
```

> Using nodemon for auto refresh after changes 
> 
> Server will be running on http://localhost:8001/ 
> 
> For UI documentation go to http://localhost:8001/docs
>
> When sending an image to `POST /content/posts` convert the image to Base64 string
