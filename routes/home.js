const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

var db = require("../models")

// This function finds the domain
function findDomain(site) {
    console.log(site)
    var domainList = ['.com', '.edu', '.gov', '.io']
    var domainIndex;
    for (var i = 0; i < domainList.length; i++) {
        if (site.includes(domainList[i])) {
            domainIndex = site.indexOf(domainList[i])
            return domainIndex
        }
    }

}

router.post("/scrape", (req, res) => {
    console.log("\nTHIS IS THE REQUEST FOR THE WEBSITE")
    // This is the website searched
    var webSearch = req.body.search
    // This is the domain index
    var domainIndex = findDomain(webSearch)

    // The site domain name is the website searched but with the domain attached to the end
    var siteDomain = webSearch.substring(0, domainIndex + 4)

    // Here is where we begin to grab all of our info from the page
    axios.get(webSearch).then(response => {
        var $ = cheerio.load(response.data);
        console.log($)

        var finalResults = []

        var imgCount = $("img").length
        console.log(imgCount)

        if (imgCount > 0) {
            // If we find an element with the tag 'img' it will be here
            $('img').each((i, elm) => {
                // Create the result object
                var result = {}
                console.log("\nFound an image with the tag [img]!")


                // If the source does not include a link to the image, we will add it ourselves using the siteDomain
                console.log(elm)
                if (elm) {
                    if (!elm.attribs.src.includes('https')) {
                        console.log(siteDomain + elm.attribs.src)
                        var image = siteDomain + elm.attribs.src

                        // We add the image into our result object
                        result.image = image
                        result.link = webSearch
                        console.log("\nTHIS IS WHERE THE IMAGE GOES IN")
                        console.log(result)

                        console.log(result)
                        finalResults.push(result)
                        imgCount--
                        if (imgCount === 0) {
                            res.json(finalResults)
                        }



                        // Now I want to put the results in 
                    } else {
                        result.image = elm.attribs.src
                        result.link = webSearch
                        console.log(result)

                        finalResults.push(result)
                        imgCount--
                        if (imgCount === 0) {
                            res.json(finalResults)
                        }


                    }

                }


            })
        } else {
            res.json(finalResults)
        }
    })

})

router.post("/savebook", (req, res) => {
    console.log(req.isAuthenticated())
    console.log(req.session.passport.user)

    db.Image.create(req.body).then(dbImage => {
        return db.User.findOneAndUpdate({
            _id: req.session.passport.user
        }, { $push: { savedImage: dbImage._id } })
    }).then(dbUser => {
        res.json(dbUser)
    })
})

router.get("/saved", (req, res) => {
    db.User.findOne({ _id: req.session.passport.user })
        .populate("savedImage").then(dbUser => {
            res.render('saved', dbUser)
        })
})

module.exports = router