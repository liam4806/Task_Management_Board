
let sender = $("#currentuser").val();
let receiverName;

function addFriend(name) {
  $.ajax({
    url: "/profile/search",
    type: "POST",
    data: {
      receiverName: name,
    },
    success: function () {  
    },
    complete: function(){
      $(".friend-add").prop('disabled',true);
      location.reload(true);
    }
  });
}

$(document).ready(function () {
  $(".friend-add").on("click", function (e) {
    this.disabled = true;
    $(this).prop('disabled', true);
    alert("Friend request sent");
    location.reload(true);
    
  });
  $("#accept_friend").on("click", function () {
    let senderId = $("#senderId").val();
    let senderName = $("#senderName").val();
    let receiver_Id = $("#receiver_Id").val();
    $.ajax({
      url: "/profile/search/",
      type: "POST",
      data: {
        senderId: senderId,
        senderName: senderName,
        receiver_Id: receiver_Id,
      },
      success: function () {
        $(this).parent().eq(1).remove();
      },
      complete: function () {
        location.reload(true);
      },
    });

    
  });
  $("#cancel_friend").on("click", function () {
    let user_Id = $("#user_Id").val();
    let receiver_Id = $("#receiver_Id").val();
    $.ajax({
      url: "/profile/search/",
      type: "POST",
      data: {
        user_Id: user_Id,
        receiver_Id:receiver_Id
      },
      success: function () {
        $(this).parent().eq(1).remove();
      },
      complete: function () {
        location.reload(true);
      },
    });

    
  });
});
