const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async(req,res)=>{
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const Listing = await listing.findById(id)
    .populate({path:"reviews",
        populate:{path:"author"},
    })
    .populate("owner");
    if(!Listing){
        req.flash("error","Listing ,You requested for does not exist!");
        res.redirect("/listings");
    }
    Listing.views += 1;
    await Listing.save();

    res.render("listings/show.ejs",{Listing});
};

module.exports.createListing = async(req,res)=>{ 

        let response = await geocodingClient
        .forwardGeocode({
        query: req.body.Listing.location,
        limit: 1,
        })
        .send()
        
        let url = req.file.path;
        let filename = req.file.filename;
        
        const newListing = new listing(req.body.Listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};

        newListing.geometry = response.body.features[0].geometry;

        newListing.category = req.body.Listing.category;
        
        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success","New Listing Created");
        res.redirect("/listings");

    };

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const Listing = await listing.findById(id);
    if(!Listing){
        req.flash("error","Mania ,You requested for does not exist!");
        res.redirect("/listings");
    } 
    let originalImageUrl = Listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{Listing, originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    
    let oldListing = await listing.findById(id);

    let updatedData = { ...req.body.Listing };

    if (!updatedData.category) {
        updatedData.category = oldListing.category;
    }

    // Update the listing
    let editListing = await listing.findByIdAndUpdate(id, updatedData, { new: true });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    editListing.image = {url, filename};
    await editListing.save();
    }
    
    req.flash("success","Mania Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.categoryListings = async (req, res) => {
    const { category } = req.params;

    let allListings;
    if (category === "Trending") {
        // Instead of filtering by category, sort by views
        allListings = await listing.find({}).sort({ views: -1 }).limit(4);
    } else {
        allListings = await listing.find({ category });
    }

    const trendingListings = await listing.find({}).sort({ views: -1 }).limit(4);

    res.render("listings/index.ejs", { allListings, category, trendingListings });
};

module.exports.categorySearch = async (req, res) => {
    const query = req.query.q || "";
    let allListings = [];

    if (query.trim() !== "") {
        allListings = await listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { location: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
            ]
        });
    }

    res.render("listings/index.ejs", { allListings });
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deleteListing= await listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Mania deleted");
    res.redirect("/listings");
};