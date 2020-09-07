module.exports = () => {

  $("#veri-btn").click(function () {
    $("#mobi").addClass("hide");
    $("#veri").removeClass("hide");
    $("#veri-btn").addClass("hide");
    $("#veri-btn-2").removeClass("hide");
    $("#ft-ul").removeClass("hide");
  });


  $("#ft-ul #next-btn").click(function () {
    $("#main-div").addClass("hide");
    $("#ft-div").removeClass("hide");
    $("#fts-ul").addClass("hide");
    $("#sds-ul").removeClass("hide");
    $("#ft-ul").addClass("hide");
    $("#sd-ul").removeClass("hide");
  });

  $("#sd-ul #prev-btn").click(function () {
    $("#main-div").removeClass("hide");
    $("#ft-div").addClass("hide");
    $("#fts-ul").removeClass("hide");
    $("#sds-ul").addClass("hide");
    $("#ft-ul").removeClass("hide");
    $("#sd-ul").addClass("hide");
  });

  $("#sd-ul #next-btn").click(function () {
    $("#main-div").addClass("hide");
    $("#ft-div").addClass("hide");
    $("#sd-div").removeClass("hide");
    $("#ft-ul").addClass("hide");
    $("#sd-ul").addClass("hide");
    $("#td-ul").removeClass("hide");
    $("#sds-ul #ft-li").removeClass("current");
    $("#sds-ul #sd-li").addClass("current");
  });

  $("#td-ul #prev-btn").click(function () {
    $("#main-div").removeClass("hide");
    $("#ft-div").removeClass("hide");
    $("#sd-div").addClass("hide");
    $("#ft-ul").addClass("hide");
    $("#sd-ul").removeClass("hide");
    $("#td-ul").addClass("hide");
    $("#sds-ul #ft-li").addClass("current");
    $("#sds-ul #sd-li").removeClass("current");
  });

  $("#td-ul #next-btn").click(function () {
    $("#main-div").addClass("hide");
    $("#ft-div").addClass("hide");
    $("#sd-div").addClass("hide");
    $("#td-div").removeClass("hide");
    $("#ft-ul").addClass("hide");
    $("#sd-ul").addClass("hide");
    $("#td-ul").addClass("hide");
    $("#fd-ul").removeClass("hide");
    $("#sds-ul #ft-li").removeClass("current");
    $("#sds-ul #sd-li").removeClass("current");
    $("#sds-ul #td-li").addClass("current");
  });

  $("#fd-ul #prev-btn").click(function () {
    $("#main-div").addClass("hide");
    $("#ft-div").addClass("hide");
    $("#sd-div").removeClass("hide");
    $("#td-div").addClass("hide");
    $("#ft-ul").addClass("hide");
    $("#sd-ul").addClass("hide");
    $("#td-ul").removeClass("hide");
    $("#fd-ul").addClass("hide");
    $("#sds-ul #ft-li").removeClass("current");
    $("#sds-ul #sd-li").addClass("current");
    $("#sds-ul #td-li").removeClass("current");
  });

  $("#fd-ul #next-btn").click(function () {
    $("#main-div").addClass("hide");
    $("#ft-div").addClass("hide");
    $("#sd-div").addClass("hide");
    $("#td-div").addClass("hide");
    $("#last-div").removeClass("hide");
    $("#ft-ul").addClass("hide");
    $("#sd-ul").addClass("hide");
    $("#td-ul").addClass("hide");
    $("#fd-ul").addClass("hide");
    $("#sds-ul #ft-li").removeClass("current");
    $("#sds-ul #sd-li").removeClass("current");
    $("#sds-ul #td-li").removeClass("current");
    $("#sds-ul #lt-li").addClass("current");
  });


  $(function () {
    $('#chkStatus').change(function () {
      if ($('#chkStatus').is(':checked'))
        $("#testdiv").removeClass('hide');
      else
        $("#testdiv").addClass('hide');
    });
  });


  $(function () {
    $('#chkStatus2').change(function () {
      if ($('#chkStatus2').is(':checked'))
        $("#testdiv2").removeClass('hide');
      else
        $("#testdiv2").addClass('hide');
    });
  });

};
