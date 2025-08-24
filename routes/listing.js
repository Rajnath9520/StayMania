const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing=require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage,cloudinary} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn,
    upload.single('Listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)

    );

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    
    .put(
    isLoggedIn,
    isOwner,
    upload.single('Listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))

    .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

router.get("/category/:category", wrapAsync(listingController.categoryListings));


module.exports =router;