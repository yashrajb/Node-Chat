class Users {

    constructor(){
        this.user = [];
    }

    addUser(id,username,room){
        var user = {
            id,
            username,
            room
        };
        this.user.push(user);
        return user
    }

    removeUser(id) {
        var userId = this.getUser(id);
        if(userId){
            this.user = this.user.filter(function(obj){
             return obj.id !== userId.id;
            });
        }
        return userId;
    }

    getUser(id) {
        var tempUser = this.user.filter(function(obj){
            return obj.id === id
        });
        return tempUser[0];
    }

    getUserList(room){
        var userList = this.user.filter(function(obj){
            return obj.room === room;
        });
        var nameList = userList.map(function(obj){
            return obj.username;
        });
        return nameList;
    }

    validUsername(name,room){
        var user = this.user.filter(function(obj){
            return obj.username === name && obj.room === room;
        });
       return user
    }

    activeRooms(){
        return this.user.map(function(obj){
            return obj.room;
        });
    }

    joinUser(id,username,room){
            this.removeUser(id);
            this.addUser(id,username,room);
            console.log(this.getUser(id));

    }


}

module.exports = {
    Users
}