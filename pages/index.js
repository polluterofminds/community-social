import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useAddress } from "@thirdweb-dev/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { init, fetchQuery } from "@airstack/airstack-react";

init(process.env.NEXT_PUBLIC_AIRSTACK_KEY)

export default function Home() {
  const [nfts, setNFTs] = useState([]);
  const address = useAddress("");  

  useEffect(() => {
    if(address) {
      const fetchNfts = async () => {
        const query = `
        query NFTQuery {
          TokenBalances(
            input: {filter: {owner: {_eq: "${address}"}}, blockchain: ethereum, limit: 50}
          ) {
            TokenBalance {
              tokenAddress
              amount
              formattedAmount
              tokenType
              owner {
                addresses
              }
              tokenNfts {
                address
                tokenId
                blockchain
                contentValue {
                  image {
                    original
                  }
                }
                metaData {
                  name
                }
              }
            }
          }
        }
        `
        const { data, error } = await fetchQuery(query);

        if(!error && data.TokenBalances && data.TokenBalances.TokenBalance) {
          setNFTs(data.TokenBalances.TokenBalance);
        }
      }
  
      fetchNfts();
    }    
  }, [address])

  console.log(nfts)

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>            
            <span className={styles.gradientText0}>
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Community Social.
              </a>
            </span>
          </h1>

          {
            !address && 
            <p className={styles.description}>
              Let's take a look at what NFTs to you own!
            </p>
          }   

          <div className={styles.connect}>
            <ConnectWallet
              dropdownPosition={{
                side: "bottom",
                align: "center",
              }}
            />
          </div>
        </div>
        
        {
          nfts.length && address ? 
          <div className={styles.grid}>
          {
            nfts.map(n => {
              return (
                <Link
                  href={`/community/${n.tokenAddress}`}                        
                >
                  <div className={styles.card}>
                  <Image
                    src={n.tokenNfts && n.tokenNfts.contentValue && n.tokenNfts.contentValue.image ? n.tokenNfts.contentValue.image.original : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"}
                    alt="Image"
                    width={300}
                    height={200}
                  />
                  <div className={styles.cardText}>
                    <h2 className={styles.gradientText1}>{n.tokenNfts && n.tokenNfts.metaData ? n.tokenNfts.metaData.name : "Unnamed NFT"} ➜</h2>                      
                  </div>
                  </div>
                </Link>
              )
            })
          }        
          </div> : 
          !nfts.length && address ? 
          <div>
            <h3>It looks like you don't have any NFTs in this wallet.</h3>
          </div> : 
          <div />
        }
      </div>
    </main>
  );
}
