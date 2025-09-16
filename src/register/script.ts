
// Constants
const TRANSITION_TIME = 800; // ms
const FIELD_TIME = 100; // ms
const CLICK_MOVE_AMOUNT = 1;
const REG_ROT_DIV = 400;
const ALERT_BOX_HIDDEN = '-100%';
const ALERT_BOX_SHOWN = '10px';
const ALERT_SHOW_TIME_MS = 5000;

// Per-device (disable on mobile)
const IS_3D = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

type RegistrationState = 'before' | 'during' | 'after';
let state: RegistrationState = 'before';

// The elements
const regBox = document.querySelector('#registration-box')! as HTMLElement;
const bgImage = document.querySelector('#background-image')! as HTMLElement;
const button = document.querySelector('.button')!;
const form = document.querySelector('#signup-form')! as HTMLElement;
const exitDialogue = document.querySelector('#exit-dialogue')! as HTMLElement;
const alertBox = document.querySelector('#alert-box')! as HTMLDivElement;

// Alert box swipe up
let alertBoxClicked = false;
let alertBoxShown = false;
let alertBoxY = 0;
let alertTimeout = 0;
alertBox.addEventListener('pointerdown', e => {
	alertBoxClicked = true;
	alertBoxY = e.clientY;
});
alertBox.addEventListener('pointerup', () => alertBoxClicked = false);
window.addEventListener('pointermove', e => {
	if (!alertBoxClicked) return;
	if ((alertBoxY - e.clientY) > 10) {
		hideAlert();
		alertBoxClicked = false
	} else {
		alertBoxY = Math.max(e.clientY, alertBoxY);
	}
});

/** Alerts the user that the form wasn't filled in properly */
function formAlert(message: string) {
	zRot += (Math.random() - 0.5) * 5 * CLICK_MOVE_AMOUNT;

	if (alertBoxShown) {
		clearTimeout(alertTimeout);
	}
	alertBoxShown = true;

	// Show the alert box
	alertBox.style.transform = 'translate(-50%,5vh)';
	alertBox.innerText = message;
	alertTimeout = setTimeout(() => {
		hideAlert();
	}, ALERT_SHOW_TIME_MS);
}

function hideAlert() {
	alertBox.style.transform = 'translate(-50%,-120%)';
	alertBoxShown = false;
}

// Hook into the button...
button.addEventListener('pointerdown', () => {
	// When the buton is pressed...

	if (state === 'before') {
		// The first button press
		state = 'during';

		bgImage.classList.add('started'); // Animate the background
		buttonTransition('Someter'); // Transition the button
		// form.style.height = formExpandedHeight + 'px'; // Show the form
		form.style.display = 'unset';
		form.style.height = form.scrollHeight + 'px';
		form.style.marginBottom = '20px'; // Show the form

		// Fade the inputs in
		([...form.children] as HTMLElement[]).map((div, idx) => {
			setTimeout(
				() => div.classList.add('shown'),
				TRANSITION_TIME + FIELD_TIME * (idx - 7)
			);
		});

	} else if (state == 'during') {
		// The second button press (submit)

		const missing = formMissingMessage();
		if (missing) {
			// Don't continue if the form doesn't have info!
			formAlert(missing);
			return;
		}
		hideAlert(); // Hide alerts (if any)
		state = 'after';

		// Submit!
		(window as any).submitData();

		// Fade out form
		[...form.children].map(d => d.classList.remove('shown'));
		setTimeout(() => {
			form.style.height = '0px';
			form.style.marginBottom = '0px';
		}, TRANSITION_TIME * 0.8);

		// Fade in exit dialogue
		setTimeout(() => {
			exitDialogue.style.height = exitDialogue.scrollHeight + 'px';
			exitDialogue.style.marginBottom = '0.5em';
			setTimeout(() => {
				exitDialogue.style.opacity = '1';
			}, TRANSITION_TIME * 0.8);
		}, TRANSITION_TIME * 0.8);

		buttonTransition('Inicio'); // Transition the button
	} else if (state == 'after') {
		window.location.href = '../home';
	}
});

/** Returns an error string when */
function formMissingMessage(): string | undefined {
	// Get missing fields
	const missingName = form.children[0].querySelector('input')!.value == '';
	const missingEmailOrPhone = (
		form.children[1].querySelector('input')!.value == '' &&
		form.children[2].querySelector('input')!.value == ''
	);
	const missingParticipants = form.children[3].querySelector('input')!.value == '';

	// Get missing list
	let missing: string[] = [];
	if (missingName) { missing.push('your name'); }
	if (missingEmailOrPhone) { missing.push('your email/phone'); }
	if (missingParticipants) { missing.push('the number of participants'); }
	
	console.log(missing);
	const msgStart = 'Please fill out ';

	if (missing.length == 0) {
		return undefined;
	} else if (missing.length == 1) {
		return msgStart + missing[0];
	} else {
		return msgStart + missing.slice(0, -1).join(', ') + ', and ' + missing.slice(-1)
	}
}

// Animate a bit in 3D
let zRot = 0;
if (IS_3D) {
	let mouseXReal = window.innerWidth  / 2;
	let mouseYReal = window.innerHeight / 2;
	let mouseX = 0;
	let mouseY = 0;
	window.addEventListener('mousemove', (e) => {
		mouseXReal = e.clientX;
		mouseYReal = e.clientY;
	});
	window.addEventListener('mousedown', (e) => {
		const boxRect = regBox.getBoundingClientRect();
		if (
			e.clientX < boxRect.left || e.clientX > boxRect.right ||
			e.clientY < boxRect.top  || e.clientY > boxRect.bottom
		) return; // Skip if outside register box
		const boxCenterX = boxRect.x + boxRect.width / 2;
		const boxCenterY = boxRect.y + boxRect.height / 2;

		mouseX += (mouseXReal - boxCenterX) * CLICK_MOVE_AMOUNT;
		mouseY += (mouseYReal - boxCenterY) * CLICK_MOVE_AMOUNT;
		zRot = (mouseXReal - boxCenterX) * 0.001 * CLICK_MOVE_AMOUNT;
	});

	setInterval(() => {
		mouseX = mouseX * 0.8 + mouseXReal * 0.2;
		mouseY = mouseY * 0.8 + mouseYReal * 0.2;
		zRot *= 0.8;
		const boxTransform = 'translate(-50%,-50%) '
			+ `perspective(${(window.innerWidth + window.innerHeight) / 2}px) `;
		
		const boxRect = regBox.getBoundingClientRect();
		const boxCenterX = boxRect.x + boxRect.width / 2;
		const boxCenterY = boxRect.y + boxRect.height / 2;
		regBox.style.transform = boxTransform
			+ `rotateY(${((mouseX - boxCenterX) / REG_ROT_DIV).toFixed(2)}deg)`
			+ `rotateX(${((boxCenterY - mouseY) / REG_ROT_DIV).toFixed(2)}deg)`
			+ `rotateZ(${zRot.toFixed(2)}deg)`;

	}, 16);
}

/** Changes the button text to something else */
function buttonTransition(text: string) {
	const buttonTextElement = button.children[0] as HTMLParagraphElement;
	buttonTextElement.classList.add('transitioning');
	setTimeout(() => {
		buttonTextElement.innerText = text;
		buttonTextElement.classList.remove('transitioning');
	}, TRANSITION_TIME);
}
