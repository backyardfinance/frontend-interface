/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/backyard_programs.json`.
 */
export type BackyardPrograms = {
  address: "A4JUtVP1QPKqjBmJSjyctTijPnkTw2UjaseC8EvyDGgm";
  metadata: {
    name: "backyardPrograms";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "carrotDeposit";
      discriminator: [28, 109, 130, 58, 31, 126, 7, 101];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "inputToken";
        },
        {
          name: "signerInputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "inputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultInputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "inputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram2022";
              },
              {
                kind: "account";
                path: "shares";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "lpToken";
          writable: true;
        },
        {
          name: "signerLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram2022";
              },
              {
                kind: "account";
                path: "lpToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "arg";
                path: "vaultId";
              },
            ];
          };
        },
        {
          name: "shares";
          writable: true;
        },
        {
          name: "logProgram";
        },
        {
          name: "carrotVault";
          writable: true;
        },
        {
          name: "carrotVaultAssetAta";
          writable: true;
        },
        {
          name: "globalConfig";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              },
            ];
          };
        },
        {
          name: "carrotProgram";
          address: "CarrotwivhMpDnm27EHmRLeQ683Z1PufuqEmBZvD282s";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "tokenProgram2022";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "vaultId";
          type: "pubkey";
        },
        {
          name: "inputAmount";
          type: "u64";
        },
      ];
    },
    {
      name: "carrotWithdraw";
      discriminator: [242, 41, 80, 136, 198, 103, 159, 112];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "outputToken";
        },
        {
          name: "signerOutputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "outputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultOutputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "outputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram2022";
              },
              {
                kind: "account";
                path: "shares";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "lpToken";
          writable: true;
        },
        {
          name: "signerLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram2022";
              },
              {
                kind: "account";
                path: "lpToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "arg";
                path: "vaultId";
              },
            ];
          };
        },
        {
          name: "shares";
          writable: true;
        },
        {
          name: "logProgram";
        },
        {
          name: "carrotVault";
          writable: true;
        },
        {
          name: "carrotVaultAssetAta";
          writable: true;
        },
        {
          name: "globalConfig";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              },
            ];
          };
        },
        {
          name: "carrotProgram";
          address: "CarrotwivhMpDnm27EHmRLeQ683Z1PufuqEmBZvD282s";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "tokenProgram2022";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "vaultId";
          type: "pubkey";
        },
        {
          name: "outputAmount";
          type: "u64";
        },
      ];
    },
    {
      name: "createVault";
      discriminator: [29, 237, 247, 208, 193, 82, 54, 135];
      accounts: [
        {
          name: "master";
          writable: true;
          signer: true;
          address: "6RdP9KmhSwuUHRJ3T72TsVi3t4F2Luf7m3BRjh1w3Sor";
        },
        {
          name: "token";
        },
        {
          name: "internalLp";
        },
        {
          name: "externalLp";
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "arg";
                path: "vaultId";
              },
            ];
          };
        },
        {
          name: "tokenProgram";
        },
        {
          name: "tokenProgram2022";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "vaultId";
          type: "pubkey";
        },
      ];
    },
    {
      name: "editGlobalConfig";
      discriminator: [231, 213, 29, 40, 58, 47, 179, 152];
      accounts: [
        {
          name: "master";
          writable: true;
          signer: true;
          address: "6RdP9KmhSwuUHRJ3T72TsVi3t4F2Luf7m3BRjh1w3Sor";
        },
        {
          name: "globalConfig";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "newMaxDepositAmount";
          type: "u64";
        },
      ];
    },
    {
      name: "initGlobalConfig";
      discriminator: [140, 136, 214, 48, 87, 0, 120, 255];
      accounts: [
        {
          name: "master";
          writable: true;
          signer: true;
          address: "6RdP9KmhSwuUHRJ3T72TsVi3t4F2Luf7m3BRjh1w3Sor";
        },
        {
          name: "globalConfig";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "maxDepositAmount";
          type: "u64";
        },
      ];
    },
    {
      name: "jupiterDeposit";
      discriminator: [138, 178, 200, 28, 197, 25, 11, 51];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "inputToken";
        },
        {
          name: "signerInputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "inputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultInputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "inputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "fTokenMint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "lpToken";
          writable: true;
        },
        {
          name: "signerLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram2022";
              },
              {
                kind: "account";
                path: "lpToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "arg";
                path: "vaultId";
              },
            ];
          };
        },
        {
          name: "lendingAdmin";
        },
        {
          name: "lending";
          writable: true;
        },
        {
          name: "fTokenMint";
          writable: true;
        },
        {
          name: "supplyTokenReservesLiquidity";
          writable: true;
        },
        {
          name: "lendingSupplyPositionOnLiquidity";
          writable: true;
        },
        {
          name: "rateModel";
        },
        {
          name: "jupiterVault";
          writable: true;
        },
        {
          name: "liquidity";
          writable: true;
        },
        {
          name: "liquidityProgram";
          writable: true;
        },
        {
          name: "rewardsRateModel";
        },
        {
          name: "globalConfig";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              },
            ];
          };
        },
        {
          name: "lendingProgram";
          address: "jup3YeL8QhtSx1e253b2FDvsMNC87fDrgQZivbrndc9";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "tokenProgram2022";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "vaultId";
          type: "pubkey";
        },
        {
          name: "inputAmount";
          type: "u64";
        },
      ];
    },
    {
      name: "jupiterWithdraw";
      discriminator: [61, 131, 162, 173, 112, 94, 209, 87];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "outputToken";
        },
        {
          name: "signerOutputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "outputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultOutputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "outputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "lpToken";
          writable: true;
        },
        {
          name: "vaultLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "fTokenMint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "signerLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram2022";
              },
              {
                kind: "account";
                path: "lpToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "arg";
                path: "vaultId";
              },
            ];
          };
        },
        {
          name: "lendingAdmin";
        },
        {
          name: "lending";
          writable: true;
        },
        {
          name: "fTokenMint";
          writable: true;
        },
        {
          name: "supplyTokenReservesLiquidity";
          writable: true;
        },
        {
          name: "lendingSupplyPositionOnLiquidity";
          writable: true;
        },
        {
          name: "rateModel";
        },
        {
          name: "jupiterVault";
          writable: true;
        },
        {
          name: "claimAccount";
          writable: true;
        },
        {
          name: "liquidity";
          writable: true;
        },
        {
          name: "liquidityProgram";
          writable: true;
        },
        {
          name: "rewardsRateModel";
        },
        {
          name: "lendingProgram";
          address: "jup3YeL8QhtSx1e253b2FDvsMNC87fDrgQZivbrndc9";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "tokenProgram2022";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "vaultId";
          type: "pubkey";
        },
        {
          name: "outputAmount";
          type: "u64";
        },
      ];
    },
    {
      name: "kaminoVaultDeposit";
      discriminator: [128, 232, 134, 114, 144, 28, 215, 74];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "inputToken";
        },
        {
          name: "signerInputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "inputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultInputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "inputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "sharesMint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "lpToken";
          writable: true;
        },
        {
          name: "signerLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram2022";
              },
              {
                kind: "account";
                path: "lpToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "arg";
                path: "vaultId";
              },
            ];
          };
        },
        {
          name: "vaultState";
          writable: true;
        },
        {
          name: "tokenVault";
          writable: true;
        },
        {
          name: "baseVaultAuthority";
        },
        {
          name: "eventAuthority";
        },
        {
          name: "sharesMint";
          writable: true;
        },
        {
          name: "klendProgram";
        },
        {
          name: "globalConfig";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              },
            ];
          };
        },
        {
          name: "kaminoVault";
          address: "KvauGMspG5k6rtzrqqn7WNn3oZdyKqLKwK2XWQ8FLjd";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "tokenProgram2022";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "vaultId";
          type: "pubkey";
        },
        {
          name: "inputAmount";
          type: "u64";
        },
      ];
    },
    {
      name: "kaminoVaultWithdraw";
      discriminator: [201, 42, 196, 254, 180, 94, 9, 232];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "outputToken";
          writable: true;
        },
        {
          name: "signerOutputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "outputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultOutputAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "outputToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vaultLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "vault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "sharesMint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "lpToken";
          writable: true;
        },
        {
          name: "signerLpAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram2022";
              },
              {
                kind: "account";
                path: "lpToken";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "arg";
                path: "vaultId";
              },
            ];
          };
        },
        {
          name: "vaultState";
          writable: true;
        },
        {
          name: "reserve";
          writable: true;
        },
        {
          name: "tokenVault";
          writable: true;
        },
        {
          name: "baseVaultAuthority";
        },
        {
          name: "eventAuthority";
        },
        {
          name: "sharesMint";
          writable: true;
        },
        {
          name: "instructionSysvarAccount";
          address: "Sysvar1nstructions1111111111111111111111111";
        },
        {
          name: "lendingMarket";
        },
        {
          name: "lendingMarketAuthority";
        },
        {
          name: "reserveLiquiditySupply";
          writable: true;
        },
        {
          name: "reserveCollateralMint";
          writable: true;
        },
        {
          name: "ctokenVault";
          writable: true;
        },
        {
          name: "kaminoGlobalConfig";
        },
        {
          name: "klendProgram";
        },
        {
          name: "kaminoVault";
          address: "KvauGMspG5k6rtzrqqn7WNn3oZdyKqLKwK2XWQ8FLjd";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "tokenProgram2022";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "vaultId";
          type: "pubkey";
        },
        {
          name: "lpAmount";
          type: "u64";
        },
      ];
    },
  ];
  accounts: [
    {
      name: "globalConfig";
      discriminator: [149, 8, 156, 202, 160, 252, 176, 217];
    },
    {
      name: "lending";
      discriminator: [135, 199, 82, 16, 249, 131, 182, 241];
    },
    {
      name: "lendingAdmin";
      discriminator: [42, 8, 33, 220, 163, 40, 210, 5];
    },
    {
      name: "vault";
      discriminator: [211, 8, 232, 43, 2, 152, 117, 119];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "depositAmountsZero";
    },
    {
      code: 6001;
      name: "sharesIssuedAmountDoesNotMatch";
    },
    {
      code: 6002;
      name: "mathOverflow";
    },
    {
      code: 6003;
      name: "integerOverflow";
    },
    {
      code: 6004;
      name: "withdrawAmountBelowMinimum";
    },
    {
      code: 6005;
      name: "tooMuchLiquidityToWithdraw";
    },
    {
      code: 6006;
      name: "reserveAlreadyExists";
    },
    {
      code: 6007;
      name: "reserveNotPartOfAllocations";
    },
    {
      code: 6008;
      name: "couldNotDeserializeAccountAsReserve";
    },
    {
      code: 6009;
      name: "reserveNotProvidedInTheAccounts";
    },
    {
      code: 6010;
      name: "reserveAccountAndKeyMismatch";
    },
    {
      code: 6011;
      name: "outOfRangeOfReserveIndex";
    },
    {
      code: 6012;
      name: "cannotFindReserveInAllocations";
    },
    {
      code: 6013;
      name: "investAmountBelowMinimum";
    },
    {
      code: 6014;
      name: "adminAuthorityIncorrect";
    },
    {
      code: 6015;
      name: "baseVaultAuthorityIncorrect";
    },
    {
      code: 6016;
      name: "baseVaultAuthorityBumpIncorrect";
    },
    {
      code: 6017;
      name: "tokenMintIncorrect";
    },
    {
      code: 6018;
      name: "tokenMintDecimalsIncorrect";
    },
    {
      code: 6019;
      name: "tokenVaultIncorrect";
    },
    {
      code: 6020;
      name: "sharesMintDecimalsIncorrect";
    },
    {
      code: 6021;
      name: "sharesMintIncorrect";
    },
    {
      code: 6022;
      name: "initialAccountingIncorrect";
    },
    {
      code: 6023;
      name: "reserveIsStale";
    },
    {
      code: 6024;
      name: "notEnoughLiquidityDisinvestedToSendToUser";
    },
    {
      code: 6025;
      name: "bpsValueTooBig";
    },
    {
      code: 6026;
      name: "depositAmountBelowMinimum";
    },
    {
      code: 6027;
      name: "reserveSpaceExhausted";
    },
    {
      code: 6028;
      name: "cannotWithdrawFromEmptyVault";
    },
    {
      code: 6029;
      name: "tokensDepositedAmountDoesNotMatch";
    },
    {
      code: 6030;
      name: "amountToWithdrawDoesNotMatch";
    },
    {
      code: 6031;
      name: "liquidityToWithdrawDoesNotMatch";
    },
    {
      code: 6032;
      name: "userReceivedAmountDoesNotMatch";
    },
    {
      code: 6033;
      name: "sharesBurnedAmountDoesNotMatch";
    },
    {
      code: 6034;
      name: "disinvestedLiquidityAmountDoesNotMatch";
    },
    {
      code: 6035;
      name: "sharesMintedAmountDoesNotMatch";
    },
    {
      code: 6036;
      name: "aumDecreasedAfterInvest";
    },
    {
      code: 6037;
      name: "aumBelowPendingFees";
    },
    {
      code: 6038;
      name: "depositAmountsZeroShares";
    },
    {
      code: 6039;
      name: "withdrawResultsInZeroShares";
    },
    {
      code: 6040;
      name: "cannotWithdrawZeroShares";
    },
    {
      code: 6041;
      name: "managementFeeGreaterThanMaxAllowed";
    },
    {
      code: 6042;
      name: "vaultAumZero";
    },
    {
      code: 6043;
      name: "missingReserveForBatchRefresh";
    },
    {
      code: 6044;
      name: "minWithdrawAmountTooBig";
    },
    {
      code: 6045;
      name: "investTooSoon";
    },
    {
      code: 6046;
      name: "wrongAdminOrAllocationAdmin";
    },
    {
      code: 6047;
      name: "reserveHasNonZeroAllocationOrCTokens";
    },
    {
      code: 6048;
      name: "depositAmountGreaterThanRequestedAmount";
    },
    {
      code: 6049;
      name: "withdrawAmountLessThanWithdrawalPenalty";
    },
    {
      code: 6050;
      name: "cannotWithdrawZeroLamports";
    },
    {
      code: 6051;
      name: "noUpgradeAuthority";
    },
    {
      code: 6052;
      name: "withdrawalFeeBpsGreaterThanMaxAllowed";
    },
    {
      code: 6053;
      name: "withdrawalFeeLamportsGreaterThanMaxAllowed";
    },
    {
      code: 6054;
      name: "reserveNotWhitelisted";
    },
    {
      code: 6055;
      name: "invalidBoolLikeValue";
    },
  ];
  types: [
    {
      name: "globalConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "maxDepositAmount";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "lending";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "fTokenMint";
            type: "pubkey";
          },
          {
            name: "lendingId";
            type: "u16";
          },
          {
            name: "decimals";
            type: "u8";
          },
          {
            name: "rewardsRateModel";
            type: "pubkey";
          },
          {
            name: "liquidityExchangePrice";
            type: "u64";
          },
          {
            name: "tokenExchangePrice";
            type: "u64";
          },
          {
            name: "lastUpdateTimestamp";
            type: "u64";
          },
          {
            name: "tokenReservesLiquidity";
            type: "pubkey";
          },
          {
            name: "supplyPositionOnLiquidity";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "lendingAdmin";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "liquidityProgram";
            type: "pubkey";
          },
          {
            name: "rebalancer";
            type: "pubkey";
          },
          {
            name: "nextLendingId";
            type: "u16";
          },
          {
            name: "auths";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "vault";
      type: {
        kind: "struct";
        fields: [
          {
            name: "vaultId";
            type: "pubkey";
          },
          {
            name: "token";
            type: "pubkey";
          },
          {
            name: "internalLp";
            type: "pubkey";
          },
          {
            name: "externalLp";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
  ];
};
