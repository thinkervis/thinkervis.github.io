
document.querySelectorAll(".copy-btn").forEach((button)=>{
  button.addEventListener("click", async ()=>{
    const text = button.parentElement.querySelector("pre").innerText;
    await navigator.clipboard.writeText(text);
    const old = button.textContent;
    button.textContent = "복사됨";
    setTimeout(()=>button.textContent = old, 1200);
  });
});
