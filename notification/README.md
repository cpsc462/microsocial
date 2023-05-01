# Notification Service
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

4. cd into notificaiton
   
```
cd notification
```

5. Run your service

```
npm run dev
```

> Using nodemon for auto refresh after changes 
> 
> Server will be running on http://localhost:8004/ 
> 
> For UI documentation go to http://localhost:8004/docs

# How to Test Database using SQL Command line

1. Open a separate terminal, and go into WSL mode (Ignore if Unix/Linux user)
   
```
wsl
```

2. Install sqlite3

```
sudo apt upgrade

sudo apt install sqlite3
```

3. Go into notification directory

```
cd notification
```

4. Read database using sqlite3 command line

```
sqlite3 notification.db
```

5. To POST to your notification database run:

```
INSERT INTO table_name (sender_username, receiver_username, action, date, read)
VALUES ("<value1>", "<value2>", "<value3>", "<value4>", 0);
```

6. To GET notification from a specific user run:

```
SELECT * FROM notification WHERE receiver_username="<value2>" AND read=0;
```
# Notification Services:
- Create a new notification: POST /notifications
- Retrieve a specific notification: GET /notifications/{notificationId}
- Update a notification: PUT /notifications/{notificationId}
- Delete a notification: DELETE /notifications/{notificationId}
- Retrieve a list of notifications: GET /notifications
