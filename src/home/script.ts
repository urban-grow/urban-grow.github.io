
// Helper functions...

function waitForLoad(selector: string): Promise<HTMLElement> {
	return new Promise(resolve => {
		const interval = setInterval(() => {
			const el = document.querySelector(selector);
			if (el) {
				clearInterval(interval);
				resolve(el as HTMLElement);
			}
		}, 20);
	});
}

function onImageLoad(
	image: HTMLImageElement,
	callback: (element: HTMLImageElement) => void
) {
	if (image.complete) {
		callback(image)
	} else {
		image.addEventListener('load', () => callback(image));
	}
}

const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

async function parallax() {
	const elements = [...document.querySelectorAll('.parallax')] as HTMLElement[];
	for (const el of elements) {
		el.style.backgroundAttachment = 'fixed';
	}
}
if (!IS_MOBILE) parallax();

async function homeAnimation() {
	const bg = await waitForLoad('.title-bg-image');
	bg.style.filter = 'blur(0px) saturate(0.7)'
	setTimeout(() => {
		bg.style.transition = 'filter 4s ease-in-out';
		bg.style.filter = 'blur(6px) saturate(1.0) brightness(0.6) contrast(0.8)'
	}, 1000);

	const logo = await waitForLoad('#hero-logo') as HTMLImageElement;
	logo.style.opacity = '0';
	onImageLoad(logo, () => {
		setTimeout(() => {
			logo.style.transition = 'opacity 1.5s ease-out';
			logo.style.opacity = '1';
		}, 20);
	});
}
if (!IS_MOBILE) homeAnimation();

function gotoRegister() {
	window.location.href = '../register';
}

async function initializeComplexTeam() {
	const teamSection = await waitForLoad('#team');
	
	let teamScrollAnim = 0;
	let teamScrollTarget = 0;
	let teamScrollExtraInertia = 0;
	let notchLimiter = 0;
	function scrollTeamBy(amount: number) {
		teamScrollTarget += amount / window.innerHeight;
		notchLimiter += Math.abs(amount * 0.1) / (1 + notchLimiter);
	}

	function deltaLerp(a: number, b: number, i: number, delta: number) {
		let realI = i / delta;
		return a * (1 - realI) + b * realI;
	}

	teamSection.addEventListener('wheel', e => {
		e.preventDefault();
		scrollTeamBy(-(e.deltaY + e.deltaX));
	});

	const touches: Record<number, [ number, number ]> = {};
	teamSection.addEventListener('pointerdown', (e: PointerEvent) => {
		// for (const touch of e.changedTouches) {
		// 	touches[touch.identifier] = [ touch.clientX, 0 ];
		// }
		touches[0] = [ e.clientX, 0 ];
	});
	teamSection.addEventListener('pointerup'  , (e: PointerEvent) => {
		// for (const touch of e.changedTouches) {
		// 	teamScrollExtraInertia -= touches[touch.identifier][1];
		// 	delete touches[touch.identifier];
		// }
		teamScrollExtraInertia -= touches[0][1];
		delete touches[0];
	});
	teamSection.addEventListener('pointermove', (e: PointerEvent) => {
		e.preventDefault();
		// for (const touch of e.changedTouches) {
		// 	const newX = touch.clientX;
		// 	const lastX = touches[touch.identifier][0];
		// 	const deltaX = (lastX - newX) * 2;
		// 	touches[touch.identifier][0] = newX;
		// 	touches[touch.identifier][1] = deltaX;
		// 	scrollTeamBy(-deltaX);
		// }
		const newX = e.clientX;
		const lastX = touches[0][0];
		const deltaX = (lastX - newX) * 2;
		touches[0][0] = newX;
		touches[0][1] = deltaX;
		scrollTeamBy(-deltaX);
	});

	teamSection.style.perspective = '800px';

	let lastFrameTime = Date.now();
	let smoothDelta = 1;
	const onAnimationFrame = () => {
		const wheelRadius = 600; //Math.min(Math.max(350, window.innerWidth * 0.29412 + 153), 500);
		// console.log(wheelRadius);

		const now = Date.now();
		const delta = now - lastFrameTime;
		lastFrameTime = now;
		smoothDelta = smoothDelta * 0.8 + 16 / Math.max(delta, 1) * 0.2;

		// console.log(smoothDelta);

		scrollTeamBy(teamScrollExtraInertia);
		teamScrollExtraInertia = deltaLerp(teamScrollExtraInertia, 0, 0.07, smoothDelta);
		teamScrollAnim = deltaLerp(teamScrollAnim, teamScrollTarget, 0.5, smoothDelta);
		// teamScrollAnim = teamScrollTarget;

		let elIdx = 0;
		const cards = teamSection.children as unknown as HTMLElement[];
		const spacing = 2 * Math.PI / cards.length;
		for (const el of cards) {
			const x = (Math.sin(teamScrollAnim + elIdx * spacing) * wheelRadius / teamSection.clientWidth) * 100;
			let y = (Math.cos(teamScrollAnim + elIdx * spacing) + 1) * 0.5;

			el.style.left = (50 + x) + '%';
			el.style.transform = `translate(-50%, -50%) scale(${y}) rotate3d(0, 1, 0, ${x * 0.9}deg)`;
			el.style.zIndex = Math.round(y * 100) + '';

			y *= 1.3;
			y -= 0.3;
			if (y < 0) y = 0;
			el.style.opacity = y + '';

			elIdx++;
		}

		// Coerce spacing into notches
		const closestNotch = Math.round(teamScrollAnim / (2 * Math.PI) * teamSection.children.length) / teamSection.children.length * (2 * Math.PI);
		const distanceToNotch = Math.abs(teamScrollTarget - closestNotch);
		teamScrollTarget = deltaLerp(
			teamScrollTarget, closestNotch,
			(distanceToNotch / spacing) * 0.1 * (1 - Math.tanh(notchLimiter * 0.3)),
			smoothDelta
		);
		notchLimiter *= 0.8;

		window.requestAnimationFrame(onAnimationFrame);
	};
	window.requestAnimationFrame(onAnimationFrame);
}
initializeComplexTeam();
