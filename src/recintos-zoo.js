class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'macaco', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'gazela', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'leao', quantidade: 1 }] },
        ];

        this.animaisInfo = {
            leao: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            leopardo: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            crocodilo: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            macaco: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            gazela: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            hipopotamo: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }

    analisaRecintos(animal, quantidade) {
        const especieNormalizada = animal.toLowerCase();

        if (!this.animaisInfo[especieNormalizada]) {
            return { erro: 'Animal inválido' };
        }

        if (quantidade <= 0) {
            return { erro: 'Quantidade inválida' };
        }

        const infoAnimal = this.animaisInfo[especieNormalizada];
        const tamanhoNecessarioOriginal = infoAnimal.tamanho * quantidade;
        const biomasAdequados = infoAnimal.biomas;
        const carnivoro = infoAnimal.carnivoro;

        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            const { numero, bioma, tamanhoTotal, animais: animaisExistentes } = recinto;

            const espacoOcupado = animaisExistentes.reduce((total, { especie, quantidade }) => {
                return total + this.animaisInfo[especie].tamanho * quantidade;
            }, 0);

            let espacoLivre = tamanhoTotal - espacoOcupado;
            let tamanhoNecessario = tamanhoNecessarioOriginal;

            if (!biomasAdequados.some(biomaAdequado => bioma.includes(biomaAdequado))) {
                continue;
            }

            if (carnivoro) {
                if (animaisExistentes.length > 0 && animaisExistentes.some(({ especie }) => especie !== especieNormalizada)) {
                    continue;
                }
            } else {
                if (especieNormalizada === 'hipopotamo' && animaisExistentes.length > 0 && bioma !== 'savana e rio') {
                    continue;
                }

                if (especieNormalizada === 'macaco') {
                    const quantidadeExistente = animaisExistentes.reduce((total, { especie, quantidade }) => {
                        return especie === 'macaco' ? total + quantidade : total;
                    }, 0);

                    if (quantidadeExistente > 0) {
                        espacoLivre += quantidadeExistente * infoAnimal.tamanho;
                    }
                }

                if (animaisExistentes.length > 0) {
                    tamanhoNecessario += 1;
                }
            }

            if (espacoLivre < tamanhoNecessario) {
                continue;
            }

            espacoLivre -= tamanhoNecessario;

            recintosViaveis.push(`Recinto ${numero} (espaço livre: ${espacoLivre} total: ${tamanhoTotal})`);
        }

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        recintosViaveis.sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)[0], 10);
            const numB = parseInt(b.match(/\d+/)[0], 10);
            return numA - numB;
        });

        return { recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };
