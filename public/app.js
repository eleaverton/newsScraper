


$(document).on("click", ".saveArticle", function() {
  console.log("click");
  console.log($(this).parent().parent().contents().filter(".panel-heading").contents().filter(".panel-title").children().attr("href"));
  var articleToSave = {
    title: $(this).parent().parent().contents().filter(".panel-heading").contents().filter(".panel-title").text(),
    summary: $(this).closest("div").text(),
    link: $(this).parent().parent().contents().filter(".panel-heading").contents().filter(".panel-title").children().attr("href")
  }

  console.log(articleToSave);

  $.ajax({
    type:"POST",
    url:"/save",
    data: articleToSave

  }).done(function(data){
    console.log("data "+data);
  });
  
    });

$(".saved").on("click", function(){
  $.ajax({
    type:"GET",
    url:"/saved"
  })
})

$(".seeNotes").on("click", function(){
  var artId = this.id;
  console.log(artId);
  $.ajax({
    type:"GET",
    url:"/articles/"+artId
  })
})

//add a saveNote button

$(".delete").on("click", function(){
  var artId = this.id;
  console.log(artId);
  $.ajax({
    type:"GET",
    url:"/delete/"+artId
  })
})