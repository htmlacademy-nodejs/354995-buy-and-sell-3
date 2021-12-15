'use strict';

const {HttpCode} = require(`../../constants`);
const {Router} = require(`express`);
const offerExists = require(`../midlewares/offerExists`);
const offerValidator = require(`../midlewares/offerValidator`);

const offerKeys = [`category`, `description`, `picture`, `title`, `type`, `sum`];
const commentKeys = [`text`];

const route = new Router();

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offerService.findAll();
    res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.post(`/`, offerValidator(offerKeys), (req, res) => {
    const offer = offerService. create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:offerId`, offerValidator(offerKeys), (req, res) => {
    const {offerId} = req.params;
    const existOffer = offerService.findOne(offerId);

    if (!existOffer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found offer with id:${offerId}`);
    }

    const updatedOffer = offerService.update(offerId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedOffer);
  });

  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const deletedOffer = offerService.drop(offerId);

    if (!deletedOffer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found offer with id:${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(deletedOffer);
  });

  route.get(`/:offerId/comments`, offerExists(offerService), (req, res) => {
    const {offer} = res.locals;
    const comments = commentService.findAll(offer);

    return res.status(HttpCode.OK)
        .json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExists(offerService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(offer, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found comment with id:${commentId}`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:offerId/comments`, [offerExists(offerService), offerValidator(commentKeys)], (req, res) => {
    const {offer} = res.locals;
    const createdComment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED)
      .json(createdComment);
  });
};
