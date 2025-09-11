
// Load: fetch('../common/presentation.ts').then(r => r.text()).then(t => (1, eval)(t));

let scrollPos = 0;
let scrollPosTarget = 0;
window.addEventListener('pointerdown', e => {
	scrollPosTarget += (e.clientY - window.innerHeight / 2) * 1.1;
})

function doScroll() {
	scrollPos = scrollPos * 0.92 + scrollPosTarget * 0.08;
	document.body.scrollBy(0, scrollPos - document.body.scrollTop);
	window.requestAnimationFrame(doScroll);
}
doScroll();
