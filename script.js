let isScrolling = false;
let currentSectionIndex = 0;
const sections = document.querySelectorAll("section");

document.body.style.overflow = "hidden";

function scrollToSection(index) {
    if (isScrolling || index < 0 || index >= sections.length) return;
    
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
        isScrolling = false;
        currentSectionIndex = index;
        triggerAnimations(index);
        resetOtherSections(index);
    }, 800);
}

function triggerAnimations(index) {
    const content = sections[index].querySelector(".content");
    if (content) {
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";

        const images = content.querySelectorAll("img");
        const text = content.querySelectorAll("p");

        images.forEach((img, i) => {
            setTimeout(() => {
                img.style.opacity = "1";
                img.style.transform = "translateX(0)";
            }, 400 + i * 200);
        });

        text.forEach((p, i) => {
            setTimeout(() => {
                p.style.opacity = "1";
                p.style.transform = "translateX(0)";
            }, 600 + i * 200);
        });
    }
}

function resetOtherSections(activeIndex) {
    sections.forEach((section, index) => {
        if (index !== activeIndex) {
            const content = section.querySelector(".content");
            if (content) {
                content.style.opacity = "0";
                content.style.transform = "translateY(20px)";

                const images = content.querySelectorAll("img");
                const text = content.querySelectorAll("p");

                images.forEach(img => {
                    img.style.opacity = "0";
                    img.style.transform = "translateX(10px)";
                });

                text.forEach(p => {
                    p.style.opacity = "0";
                    p.style.transform = "translateX(10px)";
                });
            }
        }
    });
}

window.addEventListener("wheel", (event) => {
    if (isScrolling) return;
    event.preventDefault();
    if (event.deltaY > 0 && currentSectionIndex < sections.length - 1) {
        scrollToSection(currentSectionIndex + 1);
    } else if (event.deltaY < 0 && currentSectionIndex > 0) {
        scrollToSection(currentSectionIndex - 1);
    }
}, { passive: false });

let touchStartY = 0;
window.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0].clientY;
});

window.addEventListener("touchmove", (event) => {
    event.preventDefault();
}, { passive: false });

window.addEventListener("touchend", (event) => {
    let touchEndY = event.changedTouches[0].clientY;
    if (isScrolling) return;
    if (touchStartY > touchEndY + 50 && currentSectionIndex < sections.length - 1) {
        scrollToSection(currentSectionIndex + 1);
    } else if (touchStartY < touchEndY - 50 && currentSectionIndex > 0) {
        scrollToSection(currentSectionIndex - 1);
    }
});

document.querySelectorAll('.nav-links a, .dropdown-content a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (isScrolling) return;
        const targetId = this.getAttribute('href');
        isScrolling = true;
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            isScrolling = false;
            triggerAnimations([...sections].indexOf(document.querySelector(targetId)));
            resetOtherSections([...sections].indexOf(document.querySelector(targetId)));
        }, 800);
    });
});

document.querySelector(".dropbtn").addEventListener("click", function (e) {
    e.stopPropagation();
    document.querySelector(".dropdown").classList.toggle("active");
});

document.addEventListener("click", function (e) {
    const dropdown = document.querySelector(".dropdown");
    if (!dropdown.contains(e.target)) {
        setTimeout(() => dropdown.classList.remove("active"), 300);
    }
});

const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 300);
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

triggerAnimations(0);