// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// Active Navigation Link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Portfolio Modal Functionality
const portfolioCards = document.querySelectorAll('.portfolio-card');
const modal = document.getElementById('portfolio-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

// Portfolio data
const portfolioData = {
  'beleza-natural': {
    title: 'Campanha Beleza Natural',
    subtitle: 'Linha de produtos para cuidados com a pele',
    description: `
      <h3>Objetivos da Campanha</h3>
      <p>A Beleza Natural buscava aumentar o conhecimento da marca entre o público jovem adulto (18-35 anos) e impulsionar as vendas de sua nova linha de cuidados faciais. O desafio era comunicar os benefícios dos produtos de forma autêntica e engajante.</p>
      
      <h3>Estratégia Desenvolvida</h3>
      <p>Criamos uma campanha focada em "beleza real" e "cuidado autêntico". Desenvolvemos uma série de 5 vídeos mostrando minha rotina de skincare matinal e noturna, utilizando os produtos da marca de forma natural e espontânea.</p>
      
      <h3>Resultados Alcançados</h3>
      <p>A campanha superou todas as expectativas com +150.000 visualizações orgânicas, taxa de engajamento de 8.5% e aumento de 25% nas vendas online durante o período da campanha. O vídeo principal se tornou viral no TikTok e Instagram Reels.</p>
    `,
    stats: [
      { number: '150K+', label: 'Visualizações' },
      { number: '8.5%', label: 'Taxa Engajamento' },
      { number: '25%', label: 'Aumento Vendas' },
      { number: '2.3K', label: 'Comentários' }
    ]
  },
  'super-premium': {
    title: 'Campanha Super Premium',
    subtitle: 'Promoção especial produtos orgânicos',
    description: `
      <h3>Objetivos da Campanha</h3>
      <p>O Super Premium queria destacar sua linha de produtos orgânicos e sustentáveis, aumentando o tráfego nas lojas físicas e vendas online. O foco era educar o consumidor sobre os benefícios dos alimentos orgânicos.</p>
      
      <h3>Estratégia Desenvolvida</h3>
      <p>Criamos uma campanha educativa "Vida Saudável Começa no Mercado". Produzi 8 vídeos curtos mostrando como escolher produtos orgânicos, receitas rápidas e saudáveis, além de dicas de armazenamento.</p>
      
      <h3>Resultados Alcançados</h3>
      <p>A campanha gerou +300.000 impressões, aumentou o tráfego no site em 40% e resultou em 15% de aumento nas vendas de produtos orgânicos. Os vídeos foram compartilhados nas redes sociais do supermercado.</p>
    `,
    stats: [
      { number: '300K+', label: 'Impressões' },
      { number: '40%', label: 'Aumento Tráfego' },
      { number: '15%', label: 'Vendas Orgânicos' },
      { number: '1.8K', label: 'Shares' }
    ]
  },
  'moda-style': {
    title: 'Campanha Moda & Style',
    subtitle: 'Coleção verão 2025',
    description: `
      <h3>Objetivos da Campanha</h3>
      <p>A Moda & Style lançava sua coleção verão 2025 e precisava gerar buzz e conversões entre o público feminino 20-40 anos. O objetivo era mostrar versatilidade e qualidade das peças.</p>
      
      <h3>Estratégia Desenvolvida</h3>
      <p>Desenvolvemos a campanha "Verão Sem Limites" com 12 looks diferentes para diversas ocasiões. Criei vídeos de "get ready with me", combinações de peças e dicas de styling para maximizar o guarda-roupa.</p>
      
      <h3>Resultados Alcançados</h3>
      <p>A campanha alcançou +200.000 usuários únicos, gerou taxa de engajamento de 12% e converteu 60% mais vendas online durante o período. Vários looks se tornaram trending no Instagram.</p>
    `,
    stats: [
      { number: '200K+', label: 'Usuários Únicos' },
      { number: '12%', label: 'Engajamento' },
      { number: '60%', label: 'Mais Conversões' },
      { number: '3.2K', label: 'Salvos' }
    ]
  },
  'gourmet-foods': {
    title: 'Campanha Gourmet Foods',
    subtitle: 'Delivery de pratos especiais',
    description: `
      <h3>Objetivos da Campanha</h3>
      <p>A Gourmet Foods queria expandir seu serviço de delivery e educar o mercado sobre pratos gourmet acessíveis. O desafio era quebrar a percepção de que comida gourmet é apenas para ocasiões especiais.</p>
      
      <h3>Estratégia Desenvolvida</h3>
      <p>Criamos "Gourmet Todo Dia" - uma série de 10 vídeos mostrando diferentes pratos em situações cotidianas. Destaquei a qualidade, sabor e conveniência do delivery, sempre de forma natural e apetitosa.</p>
      
      <h3>Resultados Alcançados</h3>
      <p>Alcançamos +120.000 visualizações, aumento de 35% nos pedidos online e expansão da base de clientes em 28%. Os vídeos geraram várias menções espontâneas de seguidores testando os pratos.</p>
    `,
    stats: [
      { number: '120K+', label: 'Visualizações' },
      { number: '35%', label: 'Aumento Pedidos' },
      { number: '28%', label: 'Novos Clientes' },
      { number: '950', label: 'Menções' }
    ]
  }
};

// Open modal when clicking on portfolio cards
portfolioCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // Don't open modal if clicking on action buttons
    if (e.target.closest('.action-btn')) {
      return;
    }
    
    const companyId = card.getAttribute('data-company');
    const data = portfolioData[companyId];
    
    if (data) {
      loadModalContent(data);
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  });
});

// Close modal
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Load modal content
function loadModalContent(data) {
  modalBody.innerHTML = `
    <div class="campaign-details">
      <div class="campaign-header">
        <h2 class="campaign-title">${data.title}</h2>
        <p class="campaign-subtitle">${data.subtitle}</p>
      </div>
      
      <div class="campaign-video">
        <div class="video-placeholder">
          <i class="fas fa-play-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
          <p>Vídeo publicitário produzido por Amanda Lima</p>
        </div>
      </div>
      
      <div class="campaign-carousel">
        <h3 style="margin-bottom: 1rem; color: var(--text-dark);">Fotos da Campanha</h3>
        <div class="carousel-container">
          <div class="carousel-slides" id="carousel-slides">
            <div class="carousel-slide">Foto 1 da campanha</div>
            <div class="carousel-slide">Foto 2 da campanha</div>
            <div class="carousel-slide">Foto 3 da campanha</div>
            <div class="carousel-slide">Foto 4 da campanha</div>
          </div>
          <button class="carousel-nav carousel-prev"><</button>
          <button class="carousel-nav carousel-next">></button>
        </div>
      </div>
      
      <div class="campaign-description">
        ${data.description}
      </div>
      
      <div class="campaign-stats">
        ${data.stats.map(stat => `
          <div class="stat-item">
            <span class="stat-number">${stat.number}</span>
            <span class="stat-label">${stat.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Initialize carousel
  initCarousel();
}

// Carousel functionality
function initCarousel() {
  const slides = document.getElementById('carousel-slides');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let currentSlide = 0;
  const totalSlides = slides.children.length;
  
  prevBtn.addEventListener('click', () => {
    currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    updateCarousel();
  });
  
  nextBtn.addEventListener('click', () => {
    currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
    updateCarousel();
  });
  
  function updateCarousel() {
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
}

// Contact Form
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const company = formData.get('company');
  const message = formData.get('message');
  
  // Create WhatsApp message
  let whatsappMessage = `Olá Amanda! Me chamo ${name}.`;
  if (company) {
    whatsappMessage += ` Represento a empresa ${company}.`;
  }
  whatsappMessage += `\n\n${message}`;
  whatsappMessage += `\n\nMeu e-mail: ${email}`;
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/5511912345678?text=${encodedMessage}`;
  
  // Open WhatsApp
  window.open(whatsappUrl, '_blank');
  
  // Reset form
  contactForm.reset();
  
  // Show success message
  alert('Mensagem preparada! Você será direcionado para o WhatsApp.');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all sections for animations
document.querySelectorAll('section').forEach(section => {
  section.classList.add('fade-in');
  observer.observe(section);
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(137, 98, 160, 0.95)';
    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.background = 'rgba(137, 98, 160, 0.95)';
    header.style.boxShadow = 'none';
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});

// Prevent modal content clicks from closing modal
modalBody.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Portfolio cards hover effect enhancement
portfolioCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.cursor = 'pointer';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.cursor = 'default';
  });
});

// Add click instruction to portfolio cards
portfolioCards.forEach(card => {
  const instruction = document.createElement('div');
  instruction.style.cssText = `
    position: absolute;
    bottom: 4.5rem;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    white-space: nowrap;
    z-index: 10;
  `;
  
  card.style.position = 'relative';
  card.appendChild(instruction);
  
  card.addEventListener('mouseenter', () => {
    instruction.style.opacity = '1';
  });
  
  card.addEventListener('mouseleave', () => {
    instruction.style.opacity = '0';
  });
});