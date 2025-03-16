// Function to enhance profile
const enhanceProfile = async () => {
  // Clean up existing elements
  const existingImage = document.getElementById("custom-message");
  const existingCard = document.getElementById("custom-card");
  if (existingImage) existingImage.remove();
  if (existingCard) existingCard.remove();

  const profileContainer = document.querySelector('[data-testid="UserName"]');
  if (!profileContainer) return;

  // Function to get yapper details
  const getYapperDetails = async () => {
    try {
      let usernameSpan;
      let attempts = 0;
      while (!usernameSpan && attempts < 10) {
        usernameSpan = profileContainer.querySelector('div[tabindex="-1"] span');
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      if (!usernameSpan) {
        console.error("Username span not found!");
        return null;
      }

      const username = usernameSpan.textContent.trim().replace("@", "");
      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://api.kaito.ai/api/v1/yaps?username=${username}`
      )}`;

      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      return JSON.parse(json.contents);
    } catch (error) {
      console.error("Error fetching yapper details:", error);
      return null;
    }
  };

  const parsedata = await getYapperDetails();
  if (!parsedata) return;

  // Create image element
  const image = document.createElement("img");
  const imageUrl = chrome.runtime && chrome.runtime.getURL 
  ? chrome.runtime.getURL("kaito.png") 
  : "https://via.placeholder.com/40";

  image.src = imageUrl;
  image.id = "custom-message";
  image.style.cssText = `
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

  // Create card element
  const card = document.createElement("div");
  card.id = "custom-card";
  card.style.cssText = `
    visibility: hidden;
    opacity: 0;
    position: absolute;
    width: 300px;
    max-width: 90%;
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

  // Add animation keyframes
  const styleTag = document.createElement("style");
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

  // Card content
  card.innerHTML = `
    <div style="padding: 20px; background: rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
      <h3 style="margin: 0; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #fff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center;">
        <img src="${chrome.runtime?.getURL?.("/kaito.png") || "https://via.placeholder.com/30"}" style="width: 30px; height: 30px; margin-right: 8px;">
        Yaps Score Details
      </h3>
    </div>
    <div style="padding: 20px; margin-left:38px">
      <ul style="list-style-type: none; padding: 0; margin: 0 auto; text-align: left;">
        <li style="padding: 10px 0; color: #e6ffe6; font-size: 16px;">
          <span style="font-weight: 600;">Total Score:</span> ${parsedata.yaps_all.toFixed(2) || 0}
        </li>
        <li style="padding: 10px 0; color: #e6ffe6; font-size: 16px;">
          <span style="font-weight: 600;">24h Change:</span> <span style="color: #10d190;">${parsedata.yaps_l24h.toFixed(2) || 0}</span>
        </li>
        <li style="padding: 10px 0; color: #e6ffe6; font-size: 16px;">
          <span style="font-weight: 600;">7 Day Change:</span> <span style="color: #10d190;">${parsedata.yaps_l7d.toFixed(2) || 0}</span>
        </li>
        <li style="padding: 10px 0; color: #e6ffe6; font-size: 16px;">
          <span style="font-weight: 600;">30 Day Change:</span> <span style="color: #10d190;">${parsedata.yaps_l30d.toFixed(2) || 0}</span>
        </li>
      </ul>
    </div>
    <div style="margin-left:-22px; padding: 18px 20px; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.2);">
      <img src="${chrome.runtime?.getURL?.("/kaito.png") || "https://via.placeholder.com/30"}" style="width: 30px; height: 30px; margin-right: 8px;">
      <p style="margin: 0; font-weight: 600; font-size: 14px; color: #10d190;">Powered by Kaito.ai</p>
    </div>
  `;

  // Append elements
  document.body.appendChild(card);
  profileContainer.appendChild(image);

  // Event listeners
  image.addEventListener("mouseover", () => {
    const rect = image.getBoundingClientRect();
    card.style.top = `${rect.bottom + window.scrollY + 15}px`;
    card.style.left = `${rect.left + window.scrollX - card.offsetWidth / 2 + rect.width / 2}px`;
  
    const cardRect = card.getBoundingClientRect();
    if (cardRect.bottom > window.innerHeight) {
      card.style.top = `${rect.top + window.scrollY - card.offsetHeight - 15}px`;
    }
  
    card.style.visibility = "visible";
    card.style.opacity = "1";
    image.style.transform = "scale(1.1)";
    image.style.opacity = "0.9";
    image.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
  });
  
  image.addEventListener("mouseout", () => {
    card.style.visibility = "hidden";
    card.style.opacity = "0";
    image.style.transform = "scale(1)";
    image.style.opacity = "1";
    image.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  });

  // image.addEventListener("mousedown", () => {
  //   image.style.transform = "scale(0.95)";
  // });

  // image.addEventListener("mouseup", () => {
  //   image.style.transform = "scale(1.1)";
  // });

  image.addEventListener("click", () => {
    // alert("Button clicked!");
  });
};

// Debounced version of enhanceProfile
let timeout;
const debouncedEnhanceProfile = () => {
  clearTimeout(timeout);
  timeout = setTimeout(enhanceProfile, 300);
};

// Track last profile to prevent unnecessary updates
let lastProfile = '';
const checkAndEnhanceProfile = () => {
  const profileContainer = document.querySelector('[data-testid="UserName"]');
  const currentProfile = profileContainer?.querySelector('div[tabindex="-1"] span')?.textContent || '';
  
  if (currentProfile && currentProfile !== lastProfile) {
    lastProfile = currentProfile;
    debouncedEnhanceProfile();
  }
};

// Set up MutationObserver
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' || mutation.type === 'subtree') {
      checkAndEnhanceProfile();
    }
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial call
checkAndEnhanceProfile();

// Cleanup on page unload
window.addEventListener('unload', () => {
  observer.disconnect();
  clearTimeout(timeout);
});