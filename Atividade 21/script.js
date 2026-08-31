// 1. O Porteiro Virtual

let idadeUsuario = +prompt("Qual é a sua idade?");

if (idadeUsuario >= 18) {
    console.log("Acesso liberado! Divirta-se.");
} else {
    console.log("Acesso negado. Você é menor de idade.");
}


// 2. Sistema de Login Secreto

const senhaCorreta = "front123";
let senhaDigitada = prompt("Digite a senha de acesso:");

if (senhaDigitada === senhaCorreta) {
    console.log("Login efetuado com sucesso!");
} else {
    console.log("Senha incorreta. Tente novamente.");
}


// 3. A Loja com Desconto Surpresa

let valorCompra = +prompt("Digite o valor da compra:");

if (valorCompra > 100) {
    valorCompra = valorCompra - 10;
}

console.log("O total a pagar é: " + valorCompra);
