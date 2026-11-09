// --- 1. AUTOMATIC SLIDESHOW LOGIC ---
const slides = document.querySelectorAll('.slide');
if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000);
}

// --- 2. WHATSAPP INTEGRATION ---
function orderViaWhatsApp(productName, price) {
    // REPLACE WITH THE ACTUAL WHATSAPP NUMBER
    const whatsappNumber = "267XXXXXXXXX"; 
    const message = `Hello Luxury Walk! I would like to order the "${productName}" for ${price}. Is it available?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}
