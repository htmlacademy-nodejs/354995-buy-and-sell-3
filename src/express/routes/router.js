'use strict';

const {Router} = require(`express`);
const router = new Router();

const mainRoutes = require(`./main-routes`);
const myRoutes = require(`./my-routes`);
const offersRoutes = require(`./offers-routes`);

router.use(`/`, mainRoutes);
router.use(`/my`, myRoutes);
router.use(`/offers`, offersRoutes);

module.exports = router;
