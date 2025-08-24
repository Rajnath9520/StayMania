const Review = require("../models/review.js");
const listing=require("../models/listing.js");

module.exports.createReview = async(req,res)=>{
    let foundListing=await listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author = req.user._id;
    foundListing.reviews.push(newReview);

    await newReview.save();
    await foundListing.save();
    req.flash("success","Review Created");

    res.redirect(`/listings/${foundListing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
        let{id,reviewId}=req.params;
        await listing.findByIdAndUpdate(id,{$Pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review deleted");
        res.redirect(`/listings/${id}`);
    }