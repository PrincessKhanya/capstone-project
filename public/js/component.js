
function showDialog(e)
{
    $("#" + e).attr("class", "fullbackground w3-round-medium");
}

function closeDialog(e)
{
    $("#" + e).attr("class", "nomessage fullbackground w3-round-medium");
}

$(".dialogClose").click(function ()
{
    var windowName = $(this).attr("windowname");
    closeDialog(windowName);
});