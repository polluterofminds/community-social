import React from 'react'
import styles from "../../styles/Home.module.css";
import Link from 'next/link';
import { init, fetchQuery } from "@airstack/airstack-react";

init(process.env.NEXT_PUBLIC_AIRSTACK_KEY)

const Community = ({ community }) => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <table>
          <thead>
            <tr>
              <td>Wallet address</td>
              <td>Social profiles</td>
            </tr>
          </thead>
          <tbody>
            {
              community && community.length &&
              community.map((c, index) => {
                return (
                  <tr key={index}>
                    <td>{c.owner.addresses[0]}</td>
                    <td>{
                      c.owner.socials ? 
                      <Link href={`/profile/${c.owner.addresses[0]}`}>See Social Profiles</Link> : "No social profiles"}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query; 
  const query = `
  query CommunityQuery {
    TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${id}"}}, blockchain: ethereum, limit: 200}
    ) {
      TokenBalance {
        owner {
          addresses
          socials {
            profileName
            userAssociatedAddresses
            dappName
          }
        }
        tokenNfts {
          address
          tokenId
          blockchain
        }
      }
    }
  }
  ` 
  const data = await fetchQuery(query);
  const community = data?.data?.TokenBalances?.TokenBalance || []
  return { props: { community } }
}

export default Community