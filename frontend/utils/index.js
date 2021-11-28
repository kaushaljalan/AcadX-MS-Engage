export const genSlots = () => {
	const slots = [];
	for(let i = 10; i < 20; i++) {
		slots.push(`${i}-${i+1}`)
	}
	return slots;
}
