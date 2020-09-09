const express = require('express');

const bodyparser = require('body-parser');


const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
const { findById } = require('../models/dishes');

var auth= require('../auth');

const DishRouter = express.Router();

DishRouter.use(bodyparser.json());

DishRouter.route('/')


    .get((req, res, next) => {
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);

            }, (err) => next(err))
            .catch((err) => next(err));

    })

    .put(auth.verifyUser,(req, res, next) => {

        res.statusCode = 403;
        res.end("this operation is invaild");

    })
    .post(auth.verifyUser,(req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);

            }, (err) => next(err))
            .catch((err) => next(err));


    })

    .delete(auth.verifyUser,(req, res, next) => {

        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);

            }, (err) => next(err))
            .catch((err) => next(err));

    });
DishRouter.route('/:dishid')

    .get((req, res, next) => {

        Dishes.findById(req.params.dishid).then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);

        }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(auth.verifyUser,(req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishid).then((reps) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(reps);

        }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(auth.verifyUser,(req, res, next) => {

        res.statusCode = 403;
        res.end("this operation is invaild");

    })
    .put(auth.verifyUser,(req, res, next) => {

        Dishes.findByIdAndUpdate(req.params.dishid, { $set: req.body }, { new: true }).then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);

        }, (err) => next(err))
            .catch((err) => next(err));
    });





DishRouter.route('/:dishid/comments')


    .get((req, res, next) => {
        Dishes.findById(req.params.dishid)
            .then((dish) => {

                if (dish = !null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                }
                else {
                    err = new Error('Dish ' + req.params.dishid + ' not found');
                    err.status = 404;
                    return next(err);
                }


            }, (err) => next(err))
            .catch((err) => next(err));

    })

    .put(auth.verifyUser,(req, res, next) => {

        res.statusCode = 403;
        res.end("this operation is invaild");

    })
    .post(auth.verifyUser,(req, res, next) => {
        Dishes.findById(req.params.dishid)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));


    })

    .delete(auth.verifyUser,(req, res, next) => {

        Dishes.findById(req.params.dishid)
            .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishid + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));

    });
DishRouter.route('/:dishid/comments/:commentid')

    .get((req, res, next) => {

        Dishes.findById(req.params.dishid)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentid) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentid));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishid + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentid + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(auth.verifyUser,(req, res, next) => {
        Dishes.findById(req.params.dishid)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentid) != null) {
                    dish.comments.id(req.params.commentid).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('comment ' + req.params.dishid + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentid + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(auth.verifyUser,(req, res, next) => {

        res.statusCode = 403;
        res.end("this operation is invaild");

    })
    .put(auth.verifyUser,(req, res, next) => {

        Dishes.findByIdAndUpdate(req.params.dishid)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentid) != null) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentid).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentid).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishid + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentid + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });



module.exports = DishRouter;
