/* menu toggle */
const menuBtn = document.getElementById("menuIcon");
const filterContainer = document.querySelector(".filterCatContainer");
const overlay = document.querySelector(".overlay");

menuBtn.addEventListener("click", () => {
    filterContainer.classList.toggle("show");
    overlay.classList.toggle("show");
});

// Close when clicking overlay
overlay.addEventListener("click", () => {
    filterContainer.classList.remove("show");
    overlay.classList.remove("show");
});

/* filter price range */
const rangevalue = document.querySelector(".slider .priceSlider");
const rangeInputvalue = document.querySelectorAll(".rangeInput input");

let priceGap = 50;

const priceInputvalue = document.querySelectorAll(".priceInput input");
for (let i = 0; i < priceInputvalue.length; i++) {
    priceInputvalue[i].addEventListener("input", e => {

        let minp = parseInt(priceInputvalue[0].value);
        let maxp = parseInt(priceInputvalue[1].value);
        let diff = maxp - minp

        if (minp < 0) {
            alert("minimum price cannot be less than 0");
            priceInputvalue[0].value = 0;
            minp = 0;
        }

        if (maxp > 1000) {
            alert("maximum price cannot be greater than 1000");
            priceInputvalue[1].value = 1000;
            maxp = 1000;
        }

        if (minp > maxp - priceGap) {
            priceInputvalue[0].value = maxp - priceGap;
            minp = maxp - priceGap;

            if (minp < 0) {
                priceInputvalue[0].value = 0;
                minp = 0;
            }
        }

        if (diff >= priceGap && maxp <= rangeInputvalue[1].max) {
            if (e.target.className === "min-input") {
                rangeInputvalue[0].value = minp;
                let value1 = rangeInputvalue[0].max;
                rangevalue.style.left = `${(minp / value1) * 100}%`;
            }
            else {
                rangeInputvalue[1].value = maxp;
                let value2 = rangeInputvalue[1].max;
                rangevalue.style.right = `${100 - (maxp / value2) * 100}%`;
            }
        }
    });

    for (let i = 0; i < rangeInputvalue.length; i++) {
        rangeInputvalue[i].addEventListener("input", e => {
            let minVal = parseInt(rangeInputvalue[0].value);
            let maxVal = parseInt(rangeInputvalue[1].value);

            let diff = maxVal - minVal
            
            if (diff < priceGap) {
            
                if (e.target.className === "minRange") {
                    rangeInputvalue[0].value = maxVal - priceGap;
                }
                else {
                    rangeInputvalue[1].value = minVal + priceGap;
                }
            }
            else {
            
                priceInputvalue[0].value = minVal;
                priceInputvalue[1].value = maxVal;
                rangevalue.style.left = `${(minVal / rangeInputvalue[0].max) * 100}%`;
                rangevalue.style.right = `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
            }
        });
    }
}