const {Users} = require('./users');
const expect =  require('expect');


describe(`Testing users`,() => {

    var users;

    beforeEach(() => {

        users = new Users();
        users.user = [{
            id:'1',
            username:'yashraj',
            room:'node course'
        },{
            id:'2',
            username:'krutik',
            room:'react course'
        },{
            id:'3',
            username:'walter white',
            room:'node course'
        }];

    })

    it(`should find the user`,() => {

       var userId = '2';
       var result = users.getUser(userId);
       
       expect(result.id).toEqual(userId);
       

    });

    it(`should not find the user`,() => {
        
               var userId = '6';
               var result = users.getUser(userId);
               expect(result).toNotExist();
    });

    it(`should remove the user`,() => {
        var userId = '2';
        var result = users.removeUser(userId);
        expect(result.id).toEqual(userId);
    });

    it(`should not remove the user`,() => {
        var result = users.removeUser(10);
        expect(result).toNotExist();
    });

    it(`should return name list`,() => {

        var result = users.getUserList('node course');
        expect(result.length).toBe(2);

    });

    it(`should not return name list`,() => {
        
                var result = users.getUserList('designers');
                expect(result.length).toBe(0);
        
            })

    it('should return an array with one object',() => {
        var newUser = new Users();
        var result = newUser.addUser('12345','yashraj','developers');
        expect(newUser.user).toEqual([result]);
    });
})