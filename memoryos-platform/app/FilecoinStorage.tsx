"use client";
import { useState, useRef } from "react";
import {
  Synapse,
  RPC_URLS,
  TOKENS,
  CONTRACT_ADDRESSES,
} from "@filoz/synapse-sdk";
import { ethers } from "ethers";
import { PandoraService } from "@filoz/synapse-sdk/pandora";

export default function FilecoinStorage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [synapse, setSynapse] = useState<any>(null);
  const [storage, setStorage] = useState<any>(null);
  const [commp, setCommp] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [downloaded, setDownloaded] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [usdfcBalance, setUsdfcBalance] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [providerInfo, setProviderInfo] = useState<any>(null);
  const [callbackLogs, setCallbackLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Connect wallet and initialize Synapse
  const connectWallet = async () => {
    setError("");
    if (!(window as any).ethereum) {
      setError("MetaMask not detected.");
      return;
    }
    setLoading("Connecting wallet...");
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setWalletConnected(true);
      // Calibration testnet only
      const syn = await Synapse.create({
        provider,
        rpcURL: RPC_URLS.calibration.http,
      });
      setSynapse(syn);
      // USDFC balance
      const bal = await syn.payments.walletBalance(TOKENS.USDFC);
      setUsdfcBalance(ethers.formatUnits(bal, 18));
      // Pandora approval
      const status = await syn.payments.serviceApproval(
        CONTRACT_ADDRESSES.PANDORA_SERVICE["calibration"]
      );
      setApproved(status.isApproved);
      // Fetch available providers
      const info = await syn.getStorageInfo();
      setProviders(info.providers);
      if (info.providers.length > 0) {
        setSelectedProvider(info.providers[0].owner);
        setProviderInfo(info.providers[0]);
      }
      // Try to find an existing live proof set for this account
      const pandora = new PandoraService(
        provider,
        CONTRACT_ADDRESSES.PANDORA_SERVICE["calibration"]
      );
      const proofSets = await pandora.getClientProofSetsWithDetails(
        accounts[0]
      );
      const liveSet = proofSets.find(
        (ps: any) =>
          ps.isLive &&
          ps.isManaged &&
          ps.pdpVerifierProofSetId &&
          ((ps as any).storageProvider || (ps as any).providerAddress)
      );
      if (liveSet) {
        const providerAddr =
          (liveSet as any).storageProvider || (liveSet as any).providerAddress;
        const stor = await syn.createStorage({
          proofSetId: liveSet.pdpVerifierProofSetId,
          providerAddress: providerAddr,
        });
        setStorage(stor);
        setSelectedProvider(providerAddr);
        const foundProvider = (info.providers || []).find(
          (p: any) => p.owner === providerAddr
        );
        if (foundProvider) setProviderInfo(foundProvider);
      }
    } catch (err: any) {
      setError(
        "Failed to connect wallet or initialize Synapse. " +
          (err?.message || err)
      );
    }
    setLoading("");
  };

  // Deposit USDFC
  const handleDeposit = async () => {
    if (!synapse) return;
    setDepositLoading(true);
    setError("");
    try {
      const amount = ethers.parseUnits(depositAmount, 18);
      const tx = await synapse.payments.deposit(amount, TOKENS.USDFC);
      await tx.wait();
      const bal = await synapse.payments.walletBalance(TOKENS.USDFC);
      setUsdfcBalance(ethers.formatUnits(bal, 18));
    } catch (err: any) {
      setError("Deposit failed.");
    }
    setDepositLoading(false);
  };

  // Approve Pandora service
  const handleApprove = async () => {
    if (!synapse) return;
    setLoading("Approving service...");
    setError("");
    try {
      const tx = await synapse.payments.approveService(
        CONTRACT_ADDRESSES.PANDORA_SERVICE["calibration"],
        ethers.parseUnits("10", 18), // 10 USDFC per epoch
        ethers.parseUnits("1000", 18) // 1000 USDFC lockup
      );
      await tx.wait();
      setApproved(true);
    } catch (err: any) {
      setError("Approval failed.");
    }
    setLoading("");
  };

  // Create storage service (advanced with callbacks)
  const createStorageService = async () => {
    if (!synapse) return;
    setLoading("Creating storage service...");
    setError("");
    setCallbackLogs([]);
    try {
      // Find providerId for selectedProvider
      const providerObj = providers.find((p) => p.owner === selectedProvider);
      const providerId = providerObj?.id;
      const stor = await synapse.createStorage({
        providerId,
        withCDN: true,
        callbacks: {
          onProviderSelected: (provider: any) => {
            setCallbackLogs((logs) => [
              ...logs,
              `Selected provider: ${provider.owner}`,
              `  PDP URL: ${provider.pdpUrl}`,
            ]);
          },
          onProofSetResolved: (info: any) => {
            setCallbackLogs((logs) => [
              ...logs,
              info.isExisting
                ? `Using existing proof set: ${info.proofSetId}`
                : `Created new proof set: ${info.proofSetId}`,
            ]);
          },
          onProofSetCreationStarted: (transaction: any, statusUrl?: string) => {
            setCallbackLogs(
              (logs) =>
                [
                  ...logs,
                  `Creation transaction: ${transaction.hash}`,
                  statusUrl ? `Monitor status at: ${statusUrl}` : undefined,
                ].filter(Boolean) as string[]
            );
          },
          onProofSetCreationProgress: (status: any) => {
            const elapsed = Math.round(status.elapsedMs / 1000);
            setCallbackLogs((logs) => {
              const progressMsg = `[${elapsed}s] Mining: ${status.transactionMined}, Live: ${status.proofSetLive}`;
              // If last log is a progress log, replace it; else, append
              if (logs.length > 0 && /Mining:/.test(logs[logs.length - 1])) {
                return [...logs.slice(0, -1), progressMsg];
              } else {
                return [...logs, progressMsg];
              }
            });
          },
        },
        providerAddress: selectedProvider,
      });
      setStorage(stor);
    } catch (err: any) {
      setError("Failed to create storage service. " + (err?.message || err));
    }
    setLoading("");
  };

  // Handle file upload
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setCommp("");
    setDownloaded(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading("Reading file...");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      setFileData(data);
    } catch (err: any) {
      setError("Failed to read file.");
    }
    setLoading("");
  };

  // Upload file to Filecoin
  const handleUpload = async () => {
    if (!storage || !fileData) return;
    setLoading("Uploading to Filecoin...");
    setError("");
    setCommp("");
    setDownloaded(null);
    try {
      const result = await storage.upload(fileData, {
        onUploadComplete: (commp: any) => {
          setCommp(commp?.toString?.() ?? String(commp));
        },
      });
      setCommp(result.commp?.toString?.() ?? String(result.commp));
    } catch (err: any) {
      setError("Upload failed.");
    }
    setLoading("");
  };

  // Download file from Filecoin
  const handleDownload = async () => {
    if (!storage || !commp) return;
    setLoading("Downloading from Filecoin...");
    setError("");
    setDownloaded(null);
    try {
      const data = await storage.providerDownload(commp);
      setDownloaded(data);
      // Download as file
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "downloaded-file";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err: any) {
      setError("Download failed.");
    }
    setLoading("");
  };

  // Helper to auto-link URLs in log messages
  function autoLink(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0070f3", textDecoration: "underline" }}
        >
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 2px 16px #0001",
        position: "relative",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 24,
          letterSpacing: -1,
        }}
      >
        Get private memory storage
      </h1>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}
      >
        <button
          onClick={connectWallet}
          disabled={walletConnected || loading !== ""}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: walletConnected ? "#e5e7eb" : "#0070f3",
            color: walletConnected ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: walletConnected ? "not-allowed" : "pointer",
            boxShadow: "0 1px 4px #0001",
            transition: "background 0.2s",
            outline: "none",
          }}
          onMouseOver={(e) => {
            if (!walletConnected) e.currentTarget.style.background = "#0059c9";
          }}
          onMouseOut={(e) => {
            if (!walletConnected) e.currentTarget.style.background = "#0070f3";
          }}
        >
          {walletConnected
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect MetaMask"}
        </button>
        <button
          onClick={handleDeposit}
          disabled={!depositAmount || loading !== ""}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: !depositAmount ? "#e5e7eb" : "#10b981",
            color: !depositAmount ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: !depositAmount ? "not-allowed" : "pointer",
            boxShadow: "0 1px 4px #0001",
            transition: "background 0.2s",
            outline: "none",
          }}
          onMouseOver={(e) => {
            if (depositAmount) e.currentTarget.style.background = "#059669";
          }}
          onMouseOut={(e) => {
            if (depositAmount) e.currentTarget.style.background = "#10b981";
          }}
        >
          Deposit
        </button>
        <button
          onClick={handleApprove}
          disabled={!synapse || loading !== ""}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: !synapse ? "#e5e7eb" : "#f59e42",
            color: !synapse ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: !synapse ? "not-allowed" : "pointer",
            boxShadow: "0 1px 4px #0001",
            transition: "background 0.2s",
            outline: "none",
          }}
          onMouseOver={(e) => {
            if (synapse) e.currentTarget.style.background = "#d97706";
          }}
          onMouseOut={(e) => {
            if (synapse) e.currentTarget.style.background = "#f59e42";
          }}
        >
          Approve Pandora
        </button>
        <button
          onClick={createStorageService}
          disabled={!synapse || !!storage || loading !== ""}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: !synapse || storage ? "#e5e7eb" : "#6366f1",
            color: !synapse || storage ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: !synapse || storage ? "not-allowed" : "pointer",
            boxShadow: "0 1px 4px #0001",
            transition: "background 0.2s",
            outline: "none",
          }}
          onMouseOver={(e) => {
            if (synapse && !storage)
              e.currentTarget.style.background = "#4338ca";
          }}
          onMouseOut={(e) => {
            if (synapse && !storage)
              e.currentTarget.style.background = "#6366f1";
          }}
        >
          Create Storage
        </button>
        <button
          onClick={handleUpload}
          disabled={!fileData || loading !== ""}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: !fileData ? "#e5e7eb" : "#2563eb",
            color: !fileData ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: !fileData ? "not-allowed" : "pointer",
            boxShadow: "0 1px 4px #0001",
            transition: "background 0.2s",
            outline: "none",
          }}
          onMouseOver={(e) => {
            if (fileData) e.currentTarget.style.background = "#1d4ed8";
          }}
          onMouseOut={(e) => {
            if (fileData) e.currentTarget.style.background = "#2563eb";
          }}
        >
          Test Upload
        </button>
        <button
          onClick={handleDownload}
          disabled={!storage || !commp || loading !== ""}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: !storage || !commp ? "#e5e7eb" : "#f43f5e",
            color: !storage || !commp ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: !storage || !commp ? "not-allowed" : "pointer",
            boxShadow: "0 1px 4px #0001",
            transition: "background 0.2s",
            outline: "none",
          }}
          onMouseOver={(e) => {
            if (storage && commp) e.currentTarget.style.background = "#be123c";
          }}
          onMouseOut={(e) => {
            if (storage && commp) e.currentTarget.style.background = "#f43f5e";
          }}
        >
          Test Download
        </button>
      </div>
      {walletConnected && (
        <div style={{ marginBottom: 16 }}>
          <div>
            <b>USDFC Balance:</b> {usdfcBalance}
            <button
              style={{
                marginLeft: 8,
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                background: "#f3f4f6",
                color: "#222",
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={async () => {
                if (synapse) {
                  setLoading("Refreshing balance...");
                  try {
                    const bal = await synapse.payments.walletBalance(
                      TOKENS.USDFC
                    );
                    setUsdfcBalance(ethers.formatUnits(bal, 18));
                  } catch {
                    setError("Failed to refresh balance.");
                  }
                  setLoading("");
                }
              }}
              disabled={loading !== ""}
            >
              Refresh
            </button>
          </div>
          <input
            type="number"
            placeholder="Deposit USDFC"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            style={{
              marginRight: 8,
              marginTop: 8,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              fontSize: 15,
            }}
            min="0"
            step="any"
            disabled={loading !== ""}
          />
          <button
            onClick={handleDeposit}
            disabled={!depositAmount || loading !== ""}
            style={{
              padding: "7px 16px",
              borderRadius: 6,
              border: "none",
              background: !depositAmount ? "#e5e7eb" : "#10b981",
              color: !depositAmount ? "#888" : "#fff",
              fontWeight: 600,
              fontSize: 15,
              cursor: !depositAmount ? "not-allowed" : "pointer",
              marginTop: 8,
            }}
          >
            Deposit
          </button>
        </div>
      )}
      {walletConnected && !approved && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={handleApprove} disabled={loading !== ""}>
            Approve Pandora Service
          </button>
        </div>
      )}
      {walletConnected && approved && !storage && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={createStorageService} disabled={loading !== ""}>
            Create Storage Service
          </button>
        </div>
      )}
      {walletConnected && approved && storage && (
        <div style={{ marginBottom: 8, color: "#228b22", fontSize: 13 }}>
          Using existing storage service (proof set) with provider:{" "}
          {(
            (storage as any).storageProvider || (storage as any).providerAddress
          )?.slice(0, 8)}
          ...
          {(
            (storage as any).storageProvider || (storage as any).providerAddress
          )?.slice(-4)}
        </div>
      )}
      {providers.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <label>
            <b>Choose Storage Provider:</b>
          </label>
          <select
            value={selectedProvider}
            onChange={(e) => {
              setSelectedProvider(e.target.value);
              const info = providers.find((p) => p.owner === e.target.value);
              setProviderInfo(info);
            }}
            style={{ marginLeft: 8 }}
            disabled={loading !== ""}
          >
            {providers.map((p, i) => (
              <option key={p.owner} value={p.owner}>
                {p.owner.slice(0, 8)}...{p.owner.slice(-4)}
              </option>
            ))}
          </select>
          {providerInfo && (
            <div style={{ fontSize: 12, marginTop: 4, color: "#555" }}>
              <div>
                <b>PDP URL:</b> {providerInfo.pdpUrl}
              </div>
              <div>
                <b>CDN:</b> {providerInfo.cdnUrl || "None"}
              </div>
              <div>
                <b>Price/TiB/month:</b>{" "}
                {providerInfo.pricePerTiBPerMonth || "N/A"}
              </div>
            </div>
          )}
        </div>
      )}
      {storage && (
        <div style={{ margin: "16px 0" }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            disabled={loading !== ""}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              fontSize: 15,
            }}
          />
          {/*
          <button
            onClick={handleUpload}
            disabled={!fileData || loading !== ""}
            style={{
              marginLeft: 8,
              padding: "7px 16px",
              borderRadius: 6,
              border: "none",
              background: !fileData ? "#e5e7eb" : "#2563eb",
              color: !fileData ? "#888" : "#fff",
              fontWeight: 600,
              fontSize: 15,
              cursor: !fileData ? "not-allowed" : "pointer",
            }}
          >
            Upload
          </button>
          */}
        </div>
      )}
      {fileName && (
        <div>
          File: <b>{fileName}</b>
        </div>
      )}
      {loading && <div>{loading}</div>}
      {commp && (
        <div style={{ marginTop: 16 }}>
          <b>CommP:</b>
          <div
            style={{
              wordBreak: "break-all",
              background: "#f5f5f5",
              padding: 8,
              borderRadius: 4,
              fontSize: 15,
              marginTop: 4,
            }}
          >
            {commp}
          </div>
          {/*
          <button
            onClick={handleDownload}
            style={{
              marginTop: 8,
              padding: "7px 16px",
              borderRadius: 6,
              border: "none",
              background: "#f43f5e",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Download from Filecoin
          </button>
          */}
        </div>
      )}
      {callbackLogs.length > 0 && (
        <div
          style={{
            margin: "20px 0",
            fontSize: 14,
            color: "#222",
            background: "#f9fafb",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 2px 8px #0001",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: 8,
              fontSize: 15,
              color: "#1a7f37",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 18, marginRight: 6 }}>🗂️</span> Storage
            Creation Progress
          </div>
          <ul style={{ margin: 0, paddingLeft: 22, listStyle: "none" }}>
            {callbackLogs.map((log, i) => {
              let icon = "⏳";
              let color = "#444";
              if (/Selected provider/i.test(log)) icon = "📦";
              if (/Using existing proof set/i.test(log)) {
                icon = "✅";
                color = "#1a7f37";
              }
              if (/Created new proof set/i.test(log)) {
                icon = "🆕";
                color = "#0070f3";
              }
              if (/Creation transaction/i.test(log)) icon = "🔗";
              if (/Monitor status at/i.test(log)) icon = "🔎";
              if (/Mining: true/i.test(log)) color = "#f59e42";
              if (/Live: true/i.test(log)) color = "#1a7f37";
              return (
                <li key={i} style={{ marginBottom: 4, color }}>
                  <span style={{ marginRight: 6 }}>{icon}</span>
                  {autoLink(log)}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      <div style={{ marginTop: 32, fontSize: 14, color: "#888" }}>
        {walletConnected && (
          <a
            href="/memory"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            style={{ display: "inline-block", marginBottom: 16 }}
          >
            Go to App
          </a>
        )}
        {/*
        <br />
        Powered by{" "}
        <a
          href="https://github.com/FilOzone/synapse-sdk"
          target="_blank"
          rel="noopener noreferrer"
        >
          synapse-sdk
        </a>
        */}
      </div>
    </div>
  );
}
