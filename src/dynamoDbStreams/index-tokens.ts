import { Client } from '@elastic/elasticsearch';
const client = new Client({ node: 'https://' + process.env.ELASTIC_ENDPOINT });

export const handler = async (changes: any, context: any) => {
   let newImage = changes.Records[0].newImage;
   try {
      await client.update({
         index: 'tokens',
         id: newImage.hash_key,
         body: {
           doc: {
            additional_notices: newImage.additional_notices,
            block_time_in_minutes: newImage.block_time_in_minutes,
            categories: newImage.categories,
            country_origin: newImage.country_origin,
            description: newImage.description,
            genesis_date: newImage.genesis_date,
            gsi_eth_hash: newImage.gsi_eth_hash,
            gsi_main_tkn: newImage.gsi_main_tkn,
            gsi_main_tkn_order: newImage.gsi_main_tkn_order,
            hashing_algorithm: newImage.hashing_algorithm,
            links: newImage.links,
            localization: newImage.localization,
            name: newImage.name,
            public_notice: newImage.public_notice,
            symbol: newImage.symbol,
            update_date: newImage.update_date
           }
         }
      });
   }
   catch(e){
      console.log("DynamoDb Stream Failed Indexing in ES", JSON.stringify({changes: changes, context: context, error: e }));
   }
}

/**
 * CHANGES ARG
 {
    "Records": [
        {
            "eventID": "92769387199443ca86f58bddb59745ef",
            "eventName": "MODIFY",
            "eventVersion": "1.1",
            "eventSource": "aws:dynamodb",
            "awsRegion": "us-east-1",
            "dynamodb": {
                "ApproximateCreationDateTime": 1619268870,
                "Keys": {
                    "hash_key": {
                        "S": "eth"
                    }
                },
                "NewImage": {
                    "localization": {
                        "M": {
                            "de": {
                                "S": "Ethereum"
                            },
                            "sv": {
                                "S": "Ethereum"
                            },
                            "ru": {
                                "S": "эфириум"
                            },
                            "pt": {
                                "S": "Ethereum"
                            },
                            "ko": {
                                "S": "이더리움"
                            },
                            "zh-tw": {
                                "S": "以太幣"
                            },
                            "en": {
                                "S": "Ethereum"
                            },
                            "it": {
                                "S": "Ethereum"
                            },
                            "fr": {
                                "S": "Ethereum"
                            },
                            "hu": {
                                "S": "Ethereum"
                            },
                            "es": {
                                "S": "Ethereum"
                            },
                            "zh": {
                                "S": "以太坊"
                            },
                            "ar": {
                                "S": "يثريوم"
                            },
                            "vi": {
                                "S": "Ethereum"
                            },
                            "th": {
                                "S": "Ethereum"
                            },
                            "ja": {
                                "S": "イーサリアム"
                            },
                            "id": {
                                "S": "Ethereum"
                            },
                            "pl": {
                                "S": "Ethereum"
                            },
                            "ro": {
                                "S": "Ethereum"
                            },
                            "nl": {
                                "S": "Ethereum"
                            },
                            "tr": {
                                "S": "Ethereum"
                            }
                        }
                    },
                    "symbol": {
                        "S": "eth"
                    },
                    "country_origin": {
                        "S": ""
                    },
                    "public_notice": {
                        "NULL": true
                    },
                    "description": {
                        "M": {
                            "de": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "sv": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "ru": {
                                "S": "Эфириум трудно назвать типичным альткойном. Это одновременно и подобная Биткойну сеть, и платформа приложений, и полноценный язык программирования. Цель проекта состоит в том, чтобы разработчики смогли создавать и публиковать распределенные приложения, не требующие доверия к третьему лицу.\r\n\r\nУмные контракты в Ethereum представлены в виде классов, которые могут быть реализованы на различных языках, включая визуальное программирование и компилируются в байт-код для виртуальной машины Эфириума (Ethereum Virtual Machine, EVM) перед отправкой в блокчейн. Изменение состояния виртуальной машины может быть записано на полном по Тьюрингу языке сценариев."
                            },
                            "pt": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "ko": {
                                "S": "이더리움(Ethereum/ETH)은 블록체인 기술에 기반한 클라우드 컴퓨팅 플랫폼 또는 프로그래밍 언어이다. 비탈릭 부테린이 개발하였다.\r\n\r\n비탈릭 부테린은 가상화폐인 비트코인에 사용된 핵심 기술인 블록체인(blockchain)에 화폐 거래 기록뿐 아니라 계약서 등의 추가 정보를 기록할 수 있다는 점에 착안하여, 전 세계 수많은 사용자들이 보유하고 있는 컴퓨팅 자원을 활용해 분산 네트워크를 구성하고, 이 플랫폼을 이용하여 SNS, 이메일, 전자투표 등 다양한 정보를 기록하는 시스템을 창안했다. 이더리움은 C++, 자바, 파이썬, GO 등 주요 프로그래밍 언어를 지원한다.\r\n\r\n이더리움을 사물 인터넷(IoT)에 적용하면 기계 간 금융 거래도 가능해진다. 예를 들어 고장난 청소로봇이 정비로봇에 돈을 내고 정비를 받고, 청소로봇은 돈을 벌기 위해 정비로봇의 집을 청소하는 것도 가능해진다."
                            },
                            "zh-tw": {
                                "S": "Ethereum（以太幣）是一個平台和一種編程語言，使開發人員能夠建立和發布下一代分佈式應用。 Ethereum 是使用甲醚作為燃料，以激勵其網絡的第一個圖靈完備cryptocurrency。\r\nEthereum（以太幣） 是由Vitalik Buterin的創建。該項目於2014年8月獲得了美國1800萬$比特幣的價值及其crowdsale期間。\r\n在2016年，Ethereum（以太幣）的價格上漲超過50倍。"
                            },
                            "en": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "it": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "fr": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "hu": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "es": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "zh": {
                                "S": "Ethereum（以太坊）是一个平台和一种编程语言，使开发人员能够建立和发布下一代分布式应用。Ethereum 是使用甲醚作为燃料，以激励其网络的第一个图灵完备cryptocurrency。\r\nEthereum（以太坊） 是由Vitalik Buterin的创建。该项目于2014年8月获得了美国1800万$比特币的价值及其crowdsale期间。\r\n在2016年，Ethereum（以太坊）的价格上涨超过50倍。"
                            },
                            "ar": {
                                "S": ""
                            },
                            "vi": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "th": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "ja": {
                                "S": "イーサリアム (Ethereum, ETH)・プロジェクトにより開発が進められている、分散型アプリケーション（DApps）やスマート・コントラクトを構築するためのプラットフォームの名称、及び関連するオープンソース・ソフトウェア・プロジェクトの総称である。\r\n\r\nイーサリアムでは、イーサリアム・ネットワークと呼ばれるP2Pのネットワーク上でスマート・コントラクトの履行履歴をブロックチェーンに記録していく。またイーサリアムは、スマート・コントラクトを記述するチューリング完全なプログラミング言語を持ち、ネットワーク参加者はこのネットワーク上のブロックチェーンに任意のDAppsやスマート・コントラクトを記述しそれを実行することが可能になる。ネットワーク参加者が「Ether」と呼ばれるイーサリアム内部通貨の報酬を目当てに、採掘と呼ばれるブロックチェーンへのスマート・コントラクトの履行結果の記録を行うことで、その正統性を保証していく。このような仕組みにより特定の中央管理組織に依拠せず、P2P全体を実行環境としてプログラムの実行とその結果を共有することが可能になった。"
                            },
                            "id": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "pl": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "ro": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "nl": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "tr": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            }
                        }
                    },
                    "gsi_main_tkn": {
                        "S": "main_token"
                    },
                    "update_date": {
                        "N": "1619104154341"
                    },
                    "gsi_eth_hash": {
                        "S": "0x2170ed0880ac9a755fd29b2688956bd959f933f8"
                    },
                    "gsi_main_tkn_order": {
                        "N": "2"
                    },
                    "additional_notices": {
                        "L": []
                    },
                    "hash_key": {
                        "S": "eth"
                    },
                    "block_time_in_minutes": {
                        "N": "1"
                    },
                    "name": {
                        "S": "Ethereum"
                    },
                    "links": {
                        "M": {
                            "subreddit_url": {
                                "S": "https://www.reddit.com/r/ethereum"
                            },
                            "blockchain_site": {
                                "L": [
                                    {
                                        "S": "https://etherscan.io/"
                                    },
                                    {
                                        "S": "https://ethplorer.io/"
                                    },
                                    {
                                        "S": "https://blockchair.com/ethereum"
                                    },
                                    {
                                        "S": "https://eth.tokenview.com/"
                                    },
                                    {
                                        "S": "https://hecoinfo.com/token/0x64ff637fb478863b7468bc97d30a5bf3a428a1fd"
                                    }
                                ]
                            },
                            "official_forum_url": {
                                "L": [
                                    {
                                        "S": "https://forum.ethereum.org/"
                                    },
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    }
                                ]
                            },
                            "telegram_channel_identifier": {
                                "S": ""
                            },
                            "twitter_screen_name": {
                                "S": "ethereum"
                            },
                            "repos_url": {
                                "M": {
                                    "github": {
                                        "L": [
                                            {
                                                "S": "https://github.com/ethereum/go-ethereum"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/py-evm"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/aleth"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/web3.py"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/solidity"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/sharding"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/casper"
                                            },
                                            {
                                                "S": "https://github.com/paritytech/parity"
                                            }
                                        ]
                                    },
                                    "bitbucket": {
                                        "L": []
                                    }
                                }
                            },
                            "bitcointalk_thread_identifier": {
                                "N": "428589"
                            },
                            "announcement_url": {
                                "L": [
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    }
                                ]
                            },
                            "facebook_username": {
                                "S": "ethereumproject"
                            },
                            "chat_url": {
                                "L": [
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    }
                                ]
                            },
                            "homepage": {
                                "L": [
                                    {
                                        "S": "https://www.ethereum.org/"
                                    },
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    }
                                ]
                            }
                        }
                    },
                    "categories": {
                        "L": [
                            {
                                "S": "Smart Contract Platform"
                            }
                        ]
                    },
                    "genesis_date": {
                        "S": "2015-07-30"
                    },
                    "hashing_algorithm": {
                        "S": "Ethash"
                    }
                },
                "OldImage": {
                    "localization": {
                        "M": {
                            "de": {
                                "S": "Ethereum"
                            },
                            "sv": {
                                "S": "Ethereum"
                            },
                            "ru": {
                                "S": "эфириум"
                            },
                            "pt": {
                                "S": "Ethereum"
                            },
                            "ko": {
                                "S": "이더리움"
                            },
                            "zh-tw": {
                                "S": "以太幣"
                            },
                            "en": {
                                "S": "Ethereum"
                            },
                            "it": {
                                "S": "Ethereum"
                            },
                            "fr": {
                                "S": "Ethereum"
                            },
                            "hu": {
                                "S": "Ethereum"
                            },
                            "es": {
                                "S": "Ethereum"
                            },
                            "zh": {
                                "S": "以太坊"
                            },
                            "ar": {
                                "S": "يثريوم"
                            },
                            "vi": {
                                "S": "Ethereum"
                            },
                            "th": {
                                "S": "Ethereum"
                            },
                            "ja": {
                                "S": "イーサリアム"
                            },
                            "id": {
                                "S": "Ethereum"
                            },
                            "pl": {
                                "S": "Ethereum"
                            },
                            "ro": {
                                "S": "Ethereum"
                            },
                            "nl": {
                                "S": "Ethereum"
                            },
                            "tr": {
                                "S": "Ethereum"
                            }
                        }
                    },
                    "symbol": {
                        "S": "eth"
                    },
                    "country_origin": {
                        "S": ""
                    },
                    "public_notice": {
                        "NULL": true
                    },
                    "description": {
                        "M": {
                            "de": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "sv": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "ru": {
                                "S": "Эфириум трудно назвать типичным альткойном. Это одновременно и подобная Биткойну сеть, и платформа приложений, и полноценный язык программирования. Цель проекта состоит в том, чтобы разработчики смогли создавать и публиковать распределенные приложения, не требующие доверия к третьему лицу.\r\n\r\nУмные контракты в Ethereum представлены в виде классов, которые могут быть реализованы на различных языках, включая визуальное программирование и компилируются в байт-код для виртуальной машины Эфириума (Ethereum Virtual Machine, EVM) перед отправкой в блокчейн. Изменение состояния виртуальной машины может быть записано на полном по Тьюрингу языке сценариев."
                            },
                            "pt": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "ko": {
                                "S": "이더리움(Ethereum/ETH)은 블록체인 기술에 기반한 클라우드 컴퓨팅 플랫폼 또는 프로그래밍 언어이다. 비탈릭 부테린이 개발하였다.\r\n\r\n비탈릭 부테린은 가상화폐인 비트코인에 사용된 핵심 기술인 블록체인(blockchain)에 화폐 거래 기록뿐 아니라 계약서 등의 추가 정보를 기록할 수 있다는 점에 착안하여, 전 세계 수많은 사용자들이 보유하고 있는 컴퓨팅 자원을 활용해 분산 네트워크를 구성하고, 이 플랫폼을 이용하여 SNS, 이메일, 전자투표 등 다양한 정보를 기록하는 시스템을 창안했다. 이더리움은 C++, 자바, 파이썬, GO 등 주요 프로그래밍 언어를 지원한다.\r\n\r\n이더리움을 사물 인터넷(IoT)에 적용하면 기계 간 금융 거래도 가능해진다. 예를 들어 고장난 청소로봇이 정비로봇에 돈을 내고 정비를 받고, 청소로봇은 돈을 벌기 위해 정비로봇의 집을 청소하는 것도 가능해진다."
                            },
                            "zh-tw": {
                                "S": "Ethereum（以太幣）是一個平台和一種編程語言，使開發人員能夠建立和發布下一代分佈式應用。 Ethereum 是使用甲醚作為燃料，以激勵其網絡的第一個圖靈完備cryptocurrency。\r\nEthereum（以太幣） 是由Vitalik Buterin的創建。該項目於2014年8月獲得了美國1800萬$比特幣的價值及其crowdsale期間。\r\n在2016年，Ethereum（以太幣）的價格上漲超過50倍。"
                            },
                            "en": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "it": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "fr": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "hu": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "es": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "zh": {
                                "S": "Ethereum（以太坊）是一个平台和一种编程语言，使开发人员能够建立和发布下一代分布式应用。Ethereum 是使用甲醚作为燃料，以激励其网络的第一个图灵完备cryptocurrency。\r\nEthereum（以太坊） 是由Vitalik Buterin的创建。该项目于2014年8月获得了美国1800万$比特币的价值及其crowdsale期间。\r\n在2016年，Ethereum（以太坊）的价格上涨超过50倍。"
                            },
                            "ar": {
                                "S": ""
                            },
                            "vi": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "th": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "ja": {
                                "S": "イーサリアム (Ethereum, ETH)・プロジェクトにより開発が進められている、分散型アプリケーション（DApps）やスマート・コントラクトを構築するためのプラットフォームの名称、及び関連するオープンソース・ソフトウェア・プロジェクトの総称である。\r\n\r\nイーサリアムでは、イーサリアム・ネットワークと呼ばれるP2Pのネットワーク上でスマート・コントラクトの履行履歴をブロックチェーンに記録していく。またイーサリアムは、スマート・コントラクトを記述するチューリング完全なプログラミング言語を持ち、ネットワーク参加者はこのネットワーク上のブロックチェーンに任意のDAppsやスマート・コントラクトを記述しそれを実行することが可能になる。ネットワーク参加者が「Ether」と呼ばれるイーサリアム内部通貨の報酬を目当てに、採掘と呼ばれるブロックチェーンへのスマート・コントラクトの履行結果の記録を行うことで、その正統性を保証していく。このような仕組みにより特定の中央管理組織に依拠せず、P2P全体を実行環境としてプログラムの実行とその結果を共有することが可能になった。"
                            },
                            "id": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "pl": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "ro": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "nl": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            },
                            "tr": {
                                "S": "Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts. Smart contract is essentially a computer code that runs exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. It can facilitate the exchange of money, content, property, shares, or anything of value. When running on the blockchain a smart contract becomes like a self-operating computer program that automatically executes when specific conditions are met.\r\n\r\nEthereum allows programmers to run complete-turing smart contracts that is capable of any customizations. Rather than giving a set of limited operations, Ethereum allows developers to have complete control over customization of their smart contract, giving developers the power to build unique and innovative applications.\r\n\r\nEthereum being the first blockchain based smart contract platform, they have gained much popularity, resulting in new competitors fighting for market share. The competitors includes: <a href=\"https://www.coingecko.com/en/coins/ethereum_classic\">Ethereum Classic</a> which is the oldchain of Ethereum, <a href=\"https://www.coingecko.com/en/coins/qtum\">Qtum</a>, <a href=\"https://www.coingecko.com/en/coins/eos\">EOS</a>, <a href=\"https://www.coingecko.com/en/coins/neo\">Neo</a>, <a href=\"https://www.coingecko.com/en/coins/icon\">Icon</a>, <a href=\"https://www.coingecko.com/en/coins/tron\">Tron</a> and <a href=\"https://www.coingecko.com/en/coins/cardano\">Cardano</a>.\r\n\r\nEthereum wallets are fairly simple to set up with multiple popular choices such as myetherwallet, <a href=\"https://www.coingecko.com/buzz/complete-beginners-guide-to-metamask?locale=en\">metamask</a>, and <a href=\"https://www.coingecko.com/buzz/trezor-model-t-wallet-review\">Trezor</a>. Read here for more guide on using ethereum wallet: <a href=\"https://www.coingecko.com/buzz/how-to-use-an-ethereum-wallet\">How to Use an Ethereum Wallet</a>"
                            }
                        }
                    },
                    "gsi_main_tkn": {
                        "S": "main_token"
                    },
                    "update_date": {
                        "N": "1619104154341"
                    },
                    "gsi_eth_hash": {
                        "S": "0x2170ed0880ac9a755fd29b2688956bd959f933f8"
                    },
                    "gsi_main_tkn_order": {
                        "N": "2"
                    },
                    "additional_notices": {
                        "L": []
                    },
                    "hash_key": {
                        "S": "eth"
                    },
                    "block_time_in_minutes": {
                        "N": "0"
                    },
                    "name": {
                        "S": "Ethereum"
                    },
                    "links": {
                        "M": {
                            "subreddit_url": {
                                "S": "https://www.reddit.com/r/ethereum"
                            },
                            "blockchain_site": {
                                "L": [
                                    {
                                        "S": "https://etherscan.io/"
                                    },
                                    {
                                        "S": "https://ethplorer.io/"
                                    },
                                    {
                                        "S": "https://blockchair.com/ethereum"
                                    },
                                    {
                                        "S": "https://eth.tokenview.com/"
                                    },
                                    {
                                        "S": "https://hecoinfo.com/token/0x64ff637fb478863b7468bc97d30a5bf3a428a1fd"
                                    }
                                ]
                            },
                            "official_forum_url": {
                                "L": [
                                    {
                                        "S": "https://forum.ethereum.org/"
                                    },
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    }
                                ]
                            },
                            "telegram_channel_identifier": {
                                "S": ""
                            },
                            "twitter_screen_name": {
                                "S": "ethereum"
                            },
                            "repos_url": {
                                "M": {
                                    "github": {
                                        "L": [
                                            {
                                                "S": "https://github.com/ethereum/go-ethereum"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/py-evm"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/aleth"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/web3.py"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/solidity"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/sharding"
                                            },
                                            {
                                                "S": "https://github.com/ethereum/casper"
                                            },
                                            {
                                                "S": "https://github.com/paritytech/parity"
                                            }
                                        ]
                                    },
                                    "bitbucket": {
                                        "L": []
                                    }
                                }
                            },
                            "bitcointalk_thread_identifier": {
                                "N": "428589"
                            },
                            "announcement_url": {
                                "L": [
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    }
                                ]
                            },
                            "facebook_username": {
                                "S": "ethereumproject"
                            },
                            "chat_url": {
                                "L": [
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    }
                                ]
                            },
                            "homepage": {
                                "L": [
                                    {
                                        "S": "https://www.ethereum.org/"
                                    },
                                    {
                                        "S": ""
                                    },
                                    {
                                        "S": ""
                                    }
                                ]
                            }
                        }
                    },
                    "categories": {
                        "L": [
                            {
                                "S": "Smart Contract Platform"
                            }
                        ]
                    },
                    "genesis_date": {
                        "S": "2015-07-30"
                    },
                    "hashing_algorithm": {
                        "S": "Ethash"
                    }
                },
                "SequenceNumber": "11738100000000012185051020",
                "SizeBytes": 78704,
                "StreamViewType": "NEW_AND_OLD_IMAGES"
            },
            "eventSourceARN": "arn:aws:dynamodb:us-east-1:AWS_ACCOUNT_ID:table/euler-tokens-table/stream/2021-04-24T11:30:24.869"
        }
    ]
}
 */

/** CONTEXT ARG
 {
    "callbackWaitsForEmptyEventLoop": true,
    "functionVersion": "$LATEST",
    "functionName": "eulerDeployStagedevelopment-Ap-indexTokens06DEAC7F-U4WOCXH4WD9S",
    "memoryLimitInMB": "3096",
    "logGroupName": "/aws/lambda/eulerDeployStagedevelopment-Ap-indexTokens06DEAC7F-U4WOCXH4WD9S",
    "logStreamName": "2021/04/24/[$LATEST]7dc363fce43e4c51815125790d61761f",
    "invokedFunctionArn": "arn:aws:lambda:us-east-1:AWS_ACCOUNT_ID:function:eulerDeployStagedevelopment-Ap-indexTokens06DEAC7F-U4WOCXH4WD9S",
    "awsRequestId": "6e02807f-9c91-4d65-85c8-cd1c1d9c17bf"
}
 */