/ file input / 
const 
    pictureBtn = document.querySelector('.add-3'),
    fileInput = document.querySelector('.add-4 input'),
    img = document.querySelector('.add-4 img'),
    p = document.querySelector('.add-4 p'),
    div = document.querySelector('.add-4')
;
    
pictureBtn.addEventListener('click', () => {
    fileInput.click();
});
fileInput.addEventListener('change', () => {
  p.style.display = 'none';
  img.style.width = '100%';
  div.style.height = 'auto';
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = function () {
      const imgScrtrt = reader.result;
      img.src = imgScrtrt;
    };
    reader.readAsDataURL(selectedFile);
  } else {
    img.src = './assets/images/logo.svg';
    p.style.display = 'block';
  }
});


/ range input / 
const 
    rangeFile = document.querySelector('.add-8'),
    rangeValue = document.querySelector('.add-7 span')
;

setInterval(() => {
    rangeValue.innerHTML = rangeFile.value;
}, 100);


/ total price / 
function getTotal(quantity, balance){
    const spnaTotol = document.getElementById('total');
    const btnConfirm = document.querySelector('.add-x');
    total = quantity * 0.001;
    spnaTotol.innerHTML = total;
    if (balance >= total && checkingInputs()) {
        btnConfirm.classList.add('active');
    }else btnConfirm.classList.remove('active');
}

// --------- !!!!!! ----------
const userBalnce = ttttttytsywstys;
setInterval(() => {
    getTotal(rangeFile.value, userBalnce);
}, 100);


/ click confirm btn / 
const btnConfirm = document.querySelector('.add-x');

btnConfirm.addEventListener('click', () => {
    if (btnConfirm.classList == 'add-x active' && checkingInputs()) {
        // user click and have balance
        const newBalance = userBalnce-total;
        const productName = document.getElementById('1in').value;
        const productPrice = document.getElementById('2in').value;
        const productFee = document.getElementById('3in').value;
        const whatsappNumber = document.getElementById('4in').value;
        const productDescription = document.getElementById('5in').value;
        const viewsQuantity = document.getElementById('6in').value;
            

        const dataProduct = {
            newBalance: newBalance,
            productName: productName,
            productPrice: productPrice,
            productFee: productFee,
            whatsappNumber: whatsappNumber,
            productDescription: productDescription,
            viewsQuantity: viewsQuantity,
        };

        $.ajax({
            url: '/new',
            method: 'POST',
            data: {
                dataProduct: dataProduct 
            },
            success: () => {
                window.location.href = "/";
                document.getElementById('1in').value = '';
                document.getElementById('2in').value = '';
                document.getElementById('3in').value = '';
                document.getElementById('4in').value = '';
                document.getElementById('5in').value = '';
                document.getElementById('6in').value = 0;
            }
        });

    }
});


/ checking inputs / 
const checkingInputs = () => {
    const imgSrc = document.querySelector('.add-4 img').src;
    const productName = document.getElementById('1in').value;
    const productPrice = document.getElementById('2in').value;
    const productFee = document.getElementById('3in').value;
    const whatsappNumber = document.getElementById('4in').value;
    const productDescription = document.getElementById('5in').value;
    const viewsQuantity = document.getElementById('6in').value;
    if (imgSrc != '' && productName != '' && productPrice != '' && productFee != '' && whatsappNumber != '' && productDescription != '' && viewsQuantity != 0) {
        return true;
    }else return false;

};