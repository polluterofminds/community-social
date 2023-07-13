import React from 'react'
import styles from "../../styles/Home.module.css";
import { init, fetchQuery } from "@airstack/airstack-react";

init(process.env.NEXT_PUBLIC_AIRSTACK_KEY)

const Socials = ({ socials }) => {
  return (
    <div>
      {socials.map(s => {
        return (
          <div key={s.profileName}>
            <p>{s.profileName}</p>
            <a href={s.dappName === "farcaster" ? `https://warpcast.com/${s.profileName}` : `https://lenster.xyz/u/${s.profileName}`}>Follow on {s.dappName}</a>
          </div>
        )
      })}
    </div>
  )
}

const Domains = ({ domains }) => {
  return (
    <div>
      {domains.map(d => {
        return (
          <div key={d.name}>
            <p>{d.name}</p>
            <a href={`https://app.ens.domains/${d.name}`}>View on ENS</a>
          </div>
        )
      })}
    </div>
  )
}

const Profile = ({ profile, address }) => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div>
          <div>
            <h1>Wallet Address</h1>
            <p>{address}</p>
          </div>
          <div className={styles.flexRow}>
            <div>
              <h1>Social Profiles</h1>
              {
                profile.socials && 
                <Socials socials={profile.socials} />
              }
            </div>
            <div>
              <h1>ENS Profiles</h1>
              {
                profile.domains && 
                <Domains domains={profile.domains} />
              }
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query; 
  const query = `
  query walletDetails {
    Wallet(
      input: {identity: "${id}", blockchain: ethereum}
    ) {
      socials {
        dappName
        profileName
      }
      primaryDomain {
        name
      }
      domains {
        name
      }
    }
  }
  ` 
  const data = await fetchQuery(query);
  const profile = data?.data?.Wallet || null
  return { props: { profile, address: id } }
}

export default Profile