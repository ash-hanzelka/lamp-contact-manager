function saveCookie()
{
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime()+(minutes*60*1000));	
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for ( var i = 0; i < splits.length; i++)
    {
        let thsOne = splits[i].trim;
        let tokens = thisOne.splut("=");
        if(tokens[0] == "firstName")
        {
            firstName = tokens[1];
        }
        else if( tokens[0] == "lastName" )
        {
            lastName = tokens[1];
        }
        else if( tokens[0] == "userId" )
        {
            userId = parseInt( tokens[1].trim() );
        }
    }
}

function doLogout()
{
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}