$(document).ready(function () {
    $("#search-results, #user-search").empty()
    $("#search-results").append(`
        <h4>No images to display</h4>
    `)

    $("#submit-site").on('click', function (e) {
        e.preventDefault();
        $('#search-holder')[0].reportValidity()
        $(this).text("searching...")
        var self = $(this)
        var search = { search: $("#search").val().trim() }
        $("#user-search").text("You searched: " + $("#search").val().trim())
        $("#search").val("")
        $.post("/home/scrape", search, function (data) {
            self.text("search")

            var results = data
            if (results.length > 0) {
                $("#search-results").empty()
                for (var i = 0; i < results.length; i++) {
                    var div = $("<div>").addClass('card').attr("data-i", i)
                    var img = $("<img>").addClass("card-img-top scrape-img").attr("src", results[i].image).attr("alt", "image")
                    var divBody = $("<div>").addClass("card-body")
                    var link = $("<a>").addClass("card-text").attr("href", results[i].link).text("Site Link")
                    var button = $("<button>").addClass("btn save").text("📓").attr("title","Save to Library").attr("data-link", results[i].link).attr('data-img',results[i].image).attr("data-i", i)

                    $(divBody).append(link, button)
                    $(div).append(img, divBody)
                    $("#search-results").append(div)
                }
            }
            // console.log(results)

        })
    })

    $(document).on("click",".save", function(e) {
        var img = $(this).data('img')
        var link = $(this).data('link')
        var i = $(this).data("i")
        console.log(img)  
        var imagePayload = {
            image: img,
            link: link
        }
        var self = $(this)
        $.post("/home/savebook", imagePayload, function(response) {
            console.log(response)
            self.text("Image saved")
        })
        // console.log(link)
        
    })

})