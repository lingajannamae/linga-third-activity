//tests/authMiddleware.test.js

const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const httpMocks = require('node-mocks-http');

jest.mock('jsonwebtoken');
jest.mock('../models/userModel');

describe('Auth Middleware - protect', () =>{
    let req,res, next;

    beforeEach(() =>{
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should call next() if token is valid', async() =>{
        // Arrange
        req.headers.authorization = 'Bearer valid_fake_token';

        jwt.verify.mockReturnValue({id: 'user123'});

        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                id: 'user123',
                name: 'Janna'
            })
        });

        // Act
        await protect(req,res,next);

        // Assert
        expect(jwt.verify).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 401 if no token is provided', async () =>{
        // Act
        await protect(req,res,next);

        // Assert
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toStrictEqual({
            message: 'Not authorized, no token'
        });

        expect(next).not.toHaveBeenCalled();
    });

    
    it('should return 401 if token is invalid', async () => {

        req.headers.authorization = 'Bearer badtoken';

        jwt.verify.mockImplementation(()=>{
            throw new Error('Invalid token');
        });

        await protect(req,res,next);

        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });

});