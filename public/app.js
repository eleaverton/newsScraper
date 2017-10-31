$(document).on("click", ".saveArticle", function() {
  // Grab the id associated with the article from the submit button
  console.log("click");
  var articleToSave = {
    title: $(this).parent().parent().contents(".panel-title").text(),
    summary: $(this).closest("div").text(),
    link: "Need to fix"
  }

  console.log(articleToSave);
  
    });