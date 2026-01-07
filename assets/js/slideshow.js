//1. 用按鈕播放照片 2. 加入圓點 3. 自動播放 //補上備註
var slideIndex = 0;
var timer = null;
//showSlides(slideIndex);
autoPlay(true);

function plusSlides(n) {
    showSlides(slideIndex += n);

}
function currentSlides(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    clearTimeout(timer);
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");

    if (n >= slides.length) {
        slideIndex = 0;
    }

    if (n < 0) {
        slideIndex = slides.length - 1;
    }
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex].style.display = "block";

    //控制圓點播放
    for (var i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    dots[slideIndex].className += " active";
}
    
function autoPlay(isFirst) {
    var slides = document.getElementsByClassName("mySlides");
    if (isFirst) {
        slideIndex = 0;
    }else {
        slideIndex++;
    }

    if (slideIndex > slides.length) {
        slideIndex = 0;
    }
    showSlides(slideIndex);
    timer = setTimeout(autoPlay, 2000);
}