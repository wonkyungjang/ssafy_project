var LAWD_CD = "";
var DEAL_YMD = "202106";
var curData = "";
$(function () {
  $("#_btnGetid").click(function () {
    var _id = $("#_id").val();
    if (_id == "") {
      alert("아이디를 입력하세요");
    } else {
      showGetId(_id);
    }
  });
  function showGetId(id) {
    $.ajax({
      type: "GET",
      url: "./idcheck.jsp",
      async: true,
      //data:"id="+id,
      success: function (msg) {
        outputList(id, msg);
      },
    });
  }

  function outputList(id, users) {
    var list = $(users).find("user");
    var aa = false;
    $(list).each(function (index, item) {
      var tid = $(this).find("id").text();
      if (tid == id) {
        aa = true; //해당 아이디가 이미 존재해요
        return;
      }
    });
    if (aa) {
      $("#_rgetid").html("사용할 수 없는 아이디 입니다.");
      $("#_rgetid").css("background-color", "#FF0000");
      $("#_userid").val("");
    } else {
      $("#_rgetid").html("사용할 수 있는 아이디 입니다.");
      $("#_rgetid").css("background-color", "#0000FF");
      $("#_userid").val($("#_id").val());
      $("#_id").val("");
      $("#_pass").focus();
    }
  }

  $("#totalApt").click(function () {
    var gu = $("#_gu option:selected").val();
    var ServiceKey =
      "ogyWf7j1awWf3Y3DjopiHJDZqYzrGyYlFU+OkAEIGlqRPZ6yCJwg1FJlInF39DIi+lzDIh/MMdcpMAlq0tmLgA==";

    if (gu == "강남구") LAWD_CD = 11680;
    else if (gu == "종로구") LAWD_CD = 11110;

    // server에서 넘어온 data
    $.ajax({
      url: "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev",
      type: "GET",
      dataType: "xml",
      data: {
        ServiceKey: ServiceKey,
        LAWD_CD: LAWD_CD,
        DEAL_YMD: DEAL_YMD,
        numOfRows: 200,
        pageNo: 1,
      },
      success: function (response) {
        console.log(response);
        makeList(response);
      },
      error: function (xhr, status, msg) {
        console.log("상태값 : " + status + " Http에러메시지 : " + msg);
      },
    });
  });

  function makeList(data) {
    curData = data;
    var aptList = ``;
    var dong = $("#_dong option:selected").val();
    $(data)
      .find("item")
      .each(function () {
        if ($(this).find("법정동").text() == " " + dong) {
          aptList +=
            `<div class="list row col-lg-12">
          <table>
                  <tr class="aptname"><td>${$(this)
                    .find("아파트")
                    .text()} <button type="button" class="same btn btn-success" value="${$(this)
              .find("아파트")
              .text()}">조회</button>
              <button type="button" class="detail btn btn-info" value="${$(this)
                .find("아파트")
                .text()}${$(this).find("거래금액").text()}">상세</button></td></tr>
                  <tr><td>거래금액 : ${$(this).find("거래금액").text()}만원</td></tr>
                  <tr><td>면적 : ${$(this).find("전용면적").text()}</td></tr>
                  <tr><td>거래년월 : ` +
            DEAL_YMD +
            `</td></tr>
                </table>
                <hr class="my-3">
                </div>`;
        }
      });
    $("#aptList").empty().append(aptList);
  }

  $("#_gu").change(function () {
    var jongro = ["숭인동", "신교동", "인사동", "누상동", "사직동", "평창동", "필운동"];
    var gangnam = [
      "역삼동",
      "개포동",
      "청담동",
      "삼성동",
      "대치동",
      "신사동",
      "논현동",
      "압구정동",
      "세곡동",
      "자곡동",
      "율현동",
      "일원동",
      "수서동",
      "도곡동",
    ];
    var gu = $("#_gu option:selected").val();
    var dong = [];
    if (gu == "종로구") dong = jongro;
    else if (gu == "강남구") dong = gangnam;
    console.log(gu);
    $("#_dong").empty();
    for (var i = 0; i < dong.length; i++) {
      var option = $("<option value=" + dong[i] + ">" + dong[i] + "</option>");
      $("#_dong").append(option);
    }
  });
});

$(document).on("click", ".same", function () {
  var name = $(this).val();
  aptList = "";
  $(curData)
    .find("item")
    .each(function () {
      if ($(this).find("아파트").text() == name) {
        aptList +=
          `<div class="list row col-lg-12">
        <table>
                <tr class="aptname"><td>${$(this)
                  .find("아파트")
                  .text()} <button type="button" class="detail btn btn-info" value="${$(this)
            .find("아파트")
            .text()}${$(this).find("거래금액").text()}">상세</button></td></tr>
                <tr><td>거래금액 : ${$(this).find("거래금액").text()}만원</td></tr>
                <tr><td>면적 : ${$(this).find("전용면적").text()}</td></tr>
                <tr><td>거래년월 : ` +
          DEAL_YMD +
          `</td></tr>
              </table>
              <hr class="my-3">
              </div>`;
      }
    });
  $("#aptList").empty().append(aptList);
});

$(document).on("click", ".detail", function () {
  var input = $(this).val();
  aptList = "";
  $(curData)
    .find("item")
    .each(function () {
      var tmp = $(this).find("아파트").text();
      tmp += $(this).find("거래금액").text();
      if (tmp == input) {
        aptList += `<div class="list row col-lg-12">
          <table>
                  <tr class="aptname"><td>${$(this).find("아파트").text()}
                  <button type="button" class="same btn btn-success" value="${$(this)
                    .find("아파트")
                    .text()}">조회</button></td></tr>
            <tr><td>건축년도 : ${$(this).find("건축년도").text()}년</td></tr>
            <tr><td>일련번호 : ${$(this).find("일련번호").text()}</td></tr>
            <tr><td>도로명 : ${$(this).find("도로명").text()}</td></tr>
            <tr><td>도로명코드 : ${$(this).find("도로명코드").text()}</td></tr>
            <tr><td>법정동 : ${$(this).find("법정동").text()}</td></tr>
            <tr><td>지번 : ${$(this).find("지번").text()}</td></tr>
            <tr><td>지역코드 : ${$(this).find("지역코드").text()}</td></tr>
                  <tr><td>거래금액 : ${$(this).find("거래금액").text()}만원</td></tr>
                  <tr><td>면적 : ${$(this).find("전용면적").text()}</td></tr>
                  <tr><td>층 : ${$(this).find("층").text()}층</td></tr>
                  <tr><td>거래일 : 2021년 ${$(this).find("월").text()}월 ${$(this)
          .find("일")
          .text()}일
          </td></tr>
                </table>
                <hr class="my-3">
                </div>`;
      }
    });
  $("#aptList").empty().append(aptList);
});
