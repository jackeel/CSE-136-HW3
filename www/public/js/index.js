window.onload=function(){var e=document.getElementById("menu"),l=document.getElementById("sidebar");document.getElementById("menu-icon");e.onclick=function(){var t=document.getElementById("right");"none"!==l.style.display?(l.style.display="none",t.style.width="100%",e.style.color="#FFF"):(l.style.display="block",t.style.width="82%",e.style.color="#FF9EAE")};var t=document.getElementById("add-bookmark"),o=document.getElementById("add-bookmark1"),s=document.getElementById("import-bookmark"),n=document.getElementById("add-bookmark-form"),d=document.getElementById("add-bookmark-form1"),a=document.getElementById("import-bookmark-form"),c=document.getElementById("insertupdate-errors"),y=document.getElementById("insertupdate-errors1");t.onclick=function(){console.log(t),a.style.display="none",n.style.display="block",d.style.display="block",c.style.display="block",y.style.display="block",s.className="",t.className="",t.className="is-active"},o.onclick=function(){console.log(t),a.style.display="none",n.style.display="block",d.style.display="block",c.style.display="block",y.style.display="block",s.className="",t.className="",t.className="is-active"},s.onclick=function(){n.style.display="none",d.style.display="none",a.style.display="block",c.style.display="none",y.style.display="block",t.className="",s.className="",s.className="is-active"}};