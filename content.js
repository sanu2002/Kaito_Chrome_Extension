
// setTimeout(()=>{
    
const data=async function getYapperDetails() {
  try {
    const profileContainer = document.querySelector('[data-testid="UserName"] div[tabindex="-1"] span.css-1jxf684');
    const username = profileContainer.innerHTML.trim().replace('@', '').trim();
    const response = await fetch(`https://api.kaito.ai/api/v1/yaps?username=${username}`,{
      method: 'GET',
      mode: 'cors',  // Add this
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log("Here are your yappers details:", data);
  } catch (error) {
    console.error("Failed to fetch details:", error);
  }
}
data();



// },50000)




setInterval(() => {
  const profileContainer = document.querySelector('[data-testid="UserName"]');

  if (profileContainer && !document.getElementById('custom-message')) {
    let image = document.createElement('img');
    image.src = chrome.runtime && chrome.runtime.getURL 
      ? chrome.runtime.getURL('/kaito.png') 
      : 'https://via.placeholder.com/40'; 
    image.id = 'custom-message';
    image.style = `
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: block;
      margin: 0 auto 0 10px;
      border: 3px solid #10d190;
      background: linear-gradient(135deg, #26A69A, #00695C 100%);
      cursor: pointer;
      transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      outline: none;
      position: relative;
      overflow: hidden;
    `;

    let card = document.createElement('div');
    card.id = 'custom-card';
    card.style.cssText = `
      visibility: visible;
      opacity: 0;
      position: absolute;
      width: 300px;
      max-width: 90%; /* Responsive width */
      background: linear-gradient(135deg, rgb(37, 45, 44), #00695C 100%);
      color: #fff;
      padding: 0;
      border-radius: 20px;
      box-shadow: 2px 4px 10px rgba(99, 91, 91, 0.9),
                 inset 0 0 15px rgba(71, 66, 66, 0.1);
      text-align: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 9999;
      border: 4px solid transparent;
      background-clip: padding-box;
      overflow: hidden;
      animation: lightning 1.5s infinite linear;
    `;

    const styleTag = document.createElement('style');
    styleTag.textContent = `
      @keyframes lightning {
        0% { border-color: rgb(27, 29, 29); }
        10% { border-color: rgb(14, 15, 14); }
        25% { border-color: rgb(14, 15, 14); }
        30% { border-color: rgb(14, 15, 14); }
        50% { border-color: rgb(18, 19, 19); }
        75% { border-color: rgb(17, 21, 19); }
        85% { border-color: rgb(17, 21, 19); }
        100% { border-color: rgb(20, 23, 22); }
      }
    `;
    document.head.appendChild(styleTag);

    card.innerHTML = `
      <div style="
        padding: 20px; /* Increased padding for better spacing */
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      ">
        <h3 style="
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #fff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">  
        <img src="${chrome.runtime && chrome.runtime.getURL 
          ? chrome.runtime.getURL('/kaito.png') 
          : 'https://via.placeholder.com/30'}" 
          style="width: 30px; height: 30px; margin-right: 8px;">
          Yaps Score Details</h3>
      </div>
      <div style="padding: 20px; margin-left:38px">
        <ul style="list-style-type: none; padding: 0; margin: 0 auto; text-align: left;">
          <li style="padding: 10px 0; color: #e6ffe6; font-size: 16px;">
            <span style="font-weight: 600;">Total Score:</span> 1,012
          </li>
          <li style="padding: 10px 0; color: #e6ffe6; font-size: 16px;">
            <span style="font-weight: 600;">24h Change:</span> <span style="color: #10d190;">+101</span>
          </li>
          <li style="padding: 10px 0; color: #e6ffe6; font-size: 16px;">
            <span style="font-weight: 600;">7 Day Change:</span> <span style="color: #10d190;">+101</span>
          </li>
          <li style="padding: 10px 0; color: #e6ffe6; font-size: 16px;">
            <span style="font-weight: 600;">30 Day Change:</span> <span style="color: #10d190;">+656</span>
          </li>
        </ul>
      </div>
      <div style="
        margin-left:-22px;
        padding: 18px 20px; /* Adjusted padding for better alignment */
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
      ">
        <img src="${chrome.runtime && chrome.runtime.getURL 
          ? chrome.runtime.getURL('/kaito.png') 
          : 'https://via.placeholder.com/30'}" 
          style="width: 30px; height: 30px;  margin-right: 8px;">
        <p style="margin: 0; font-weight: 600; font-size: 14px; color: #10d190;">
          Powered by Kaito.ai
        </p>
      </div>
    `;

    document.body.appendChild(card);
    profileContainer.appendChild(image);

    image.addEventListener('mouseover', () => {
      const rect = image.getBoundingClientRect();

      // Adjusted top position for better alignment (increased gap to 15px)
      card.style.top = `${rect.bottom + window.scrollY + 15}px`;
      card.style.left = `${rect.left + window.scrollX - (card.offsetWidth / 2) + (rect.width / 2)}px`;

      // Ensure the card doesn't go off-screen
      const cardRect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (cardRect.bottom > viewportHeight) {
        // If card overflows bottom, position it above the image instead
        card.style.top = `${rect.top + window.scrollY - card.offsetHeight - 15}px`;
      }

      card.style.visibility = 'visible';
      card.style.opacity = '1';

      profileContainer.childNodes.forEach(node => {
        if (node !== image && node !== card) {
          node.style.opacity = '0.3';
        }
      });

      image.style.transform = 'scale(1.1)';
      image.style.opacity = '0.9';
      image.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
    });

    image.addEventListener('mouseout', () => {
      card.style.visibility = 'hidden';
      card.style.opacity = '0';

      profileContainer.childNodes.forEach(node => {
        node.style.opacity = '1';
      });

      image.style.transform = 'scale(1)';
      image.style.opacity = '1';
      image.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    });

    image.addEventListener('mousedown', () => {
      image.style.transform = 'scale(0.95)';
    });

    image.addEventListener('mouseup', () => {
      image.style.transform = 'scale(1.1)';
    });

    image.addEventListener('click', () => {
      alert('Button clicked!');
    });
  }
}, 2000);