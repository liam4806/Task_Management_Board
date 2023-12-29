
let sender = $("#currentuser").val();
console.log(sender)
let receiverName;

function addFriend(name) {
  $.ajax({
    url: "/profile/search",
    type: "POST",
    data: {
      receiverName: name,
    },
    success: function () {},
  });
}

$(document).ready(function () {
  $(".friend-add").on("click", function (e) {
    e.preventDefault();
  });
  $("#accept_friend").on("click", function () {
    let senderId = $("#senderId").val();
    let senderName = $("#senderName").val();

    $.ajax({
      url: "/profile/search/",
      type: "POST",
      data: {
        senderId: senderId,
        senderName: senderName,
      },
      success: function () {
        $(this).parent().eq(1).remove();
      },
    });
    $("#reload").load(location.href + " #reload");
  });
  $("#cancel_friend").on("click", function () {
    let user_Id = $("#user_Id").val();
    $.ajax({
      url: "/profile/search",
      type: "POST",
      data: {
        user_Id: user_Id,
      },
      success: function () {
        $(this).parent().eq(1).remove();
      },
    });
    $("#reload").load(location.href + " #reload");
  });
});
