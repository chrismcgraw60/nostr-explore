import { useCallback, useEffect, useState } from "react";
import {nip05} from 'nostr-tools'

export interface Nip05 {
    pk?: string;
    id?: string;
  }

export default function UserInfo() {
    const [nip05user] = useState<string>("chrismcgraw60@nostr.chrismcgraw60.com");
    const [pubKey, setPubkey] = useState<string | null>(null);
    const [currentProfile, setCurrentProfile] = useState<Nip05 | null>(null);
    const [errorMessage, setErrorMessage] = useState<String | null>(null);

    function handleError(err: unknown) {
        if (typeof err === "string") {
            setErrorMessage(err);
        } else if (err instanceof Error) {
            setErrorMessage(err.message);
        }
    }

    useEffect(() => {
        if (!window.nostr) {
            setErrorMessage("No User Metadata Provider.");
            return;
        }
         
        const getPkAsync = async () => {
            try {
                const pk = await window.nostr.getPublicKey();
                setPubkey(pk);
            } 
            catch(err: unknown) {
                handleError(err);
            }
        };

        setTimeout(()=>getPkAsync(), 200);

    }, []);

    useEffect(() => {
        if (!pubKey) return;

        const nip05Fetch = async () => { 
            const profile = await nip05.queryProfile(nip05user);

            if (profile) {
                setCurrentProfile({
                    id: nip05user,
                    pk: profile.pubkey
                })
            }
        }

        nip05Fetch();

    }, [pubKey]);

    return <div>
        {pubKey ? <div>{`PK: ${pubKey.substring(0, 6)}...`}</div> : <div>Loading key..</div>}
        {currentProfile ? <div>Verified</div> : <div>Unverified</div>}
    </div>

}


