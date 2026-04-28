// src/components/CertificateDownload.tsx
import React, { useRef } from 'react';
import Swal from 'sweetalert2';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
import './Certificate.css'; // CSS import karein
// import { Button } from './Button'; -- Aapka Button component
import { ArrowDown, ArrowDownToLine, Download } from 'lucide-react';

// Define the type for the certificate object
interface CertificateProps {
    id?: number; // Add ID for backend API calls
    certificate_number: string;
    type?: 'diamond' | 'jewellery';
    certifier_name: string;
    store: string;
    date: string;
    item: string;
    length: string;
    weight: string;
    gem_stone: string;
    carat_weight: string;
    color: string;
    clarity: string;
    metal_purity: string;
    value: number;
    image_url?: string;
}

interface Props {
    certificate: CertificateProps;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const CertificateDownload: React.FC<Props> = ({ certificate }) => {
    const certificate1Ref = useRef<HTMLDivElement>(null);
    const certificate2Ref = useRef<HTMLDivElement>(null);

    // Determine the background image for the portrait certificate
    const backgroundPath2 = certificate.store === '2'
        ? `${API_BASE_URL}/images/VGL.png`
        : `${API_BASE_URL}/images/VGL.png`;

    // Formatting functions
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const handleDownloadFromBackend = async () => {
        // Use themed SweetAlert buttons/styles to match home & certificate view
        const themedConfirmClass =
            'flex items-center justify-center px-6 py-2 text-sm font-semibold bg-gradient-to-r from-[#465B5D] via-[#597678] to-[#465B5D] text-white rounded-lg shadow-md hover:opacity-90 transition';
        const themedCancelClass =
            'px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition';
        const result = await Swal.fire({
            title: 'Download Certificates',
            text: 'Download both certificates as high-quality PDFs',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Download PDFs',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                popup: 'rounded-lg shadow-xl p-4',
                title: 'text-lg font-bold',
                confirmButton: themedConfirmClass,
                cancelButton: themedCancelClass,
                actions: 'flex items-center justify-center space-x-2 mt-4'
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        // Ensure we have an ID to request server-side PDFs
        if (!certificate.id) {
            await Swal.fire({
                title: 'Error',
                text: 'Certificate ID is missing. Cannot download from server.',
                icon: 'error',
                buttonsStyling: false,
                customClass: { confirmButton: themedConfirmClass }
            });
            return;
        }

        // Show loading modal with same theme
        Swal.fire({
            title: 'Preparing download...',
            html: 'Please wait while we generate your certificates.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            buttonsStyling: false,
            customClass: {
                popup: 'rounded-lg shadow-xl p-4',
                title: 'text-lg font-semibold'
            }
        });

        try {
            // Template 1 (Landscape)
            const url1 = `${API_BASE_URL}/api/certificates/${certificate.id}/download/template1`;
            await downloadFile(url1);

            // Template 2 (Portrait)
            const url2 = `${API_BASE_URL}/api/certificates/${certificate.id}/download/template2`;
            await downloadFile(url2);

            Swal.close();
            await Swal.fire({
                title: 'Success!',
                text: 'Both PDF certificates have been downloaded.',
                icon: 'success',
                buttonsStyling: false,
                customClass: { confirmButton: themedConfirmClass }
            });
        } catch (error) {
            console.error('Download error:', error);
            Swal.close();
            await Swal.fire({
                title: 'Error',
                text: 'Failed to download certificates. Please try again.',
                icon: 'error',
                buttonsStyling: false,
                customClass: { confirmButton: themedConfirmClass }
            });
        }
    };

    /**
     * Helper function to download a file from URL
     */
    // const downloadFile = async (url: string) => {
    //     const response = await fetch(url);
    //     const blob = await response.blob();
    //     const blobUrl = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = blobUrl;
    //     a.download = ''; // Backend will set the filename
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(blobUrl);
    //     await new Promise(r => setTimeout(r, 500)); // Delay between downloads
    // };

    const downloadFile = async (url: string) => {
        const response = await fetch(url);

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        let filename = 'certificate-' + certificate.certificate_number + '.pdf';
        const disposition = response.headers.get('Content-Disposition');
        if (disposition && disposition.includes('filename=')) {
            filename = disposition
                .split('filename=')[1]
                .split(';')[0]
                .replace(/["']/g, '')
                .trim();
        }

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename; // ✅ Correct name now applied
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(blobUrl);
        await new Promise((r) => setTimeout(r, 500)); // delay between downloads
    };

    return (
        <div className="certificates-wrap">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', fontFamily: "ui-serif, Georgia, Cambria, Times New Roman, Times, serif", fontSize: "1.875rem" }}>
                <button onClick={handleDownloadFromBackend} className="flex items-center justify-center space-x-2 px-8 py-4 text-base font-semibold bg-gradient-to-r from-[#465B5D] via-[#597678] to-[#465B5D] text-white rounded-lg shadow-lg hover:from-[#465B5D] hover:to-[#465B5D] transition-all">
                    <ArrowDownToLine className="w-5 h-5" />
                    <span>Confirm & Download Both Certificates</span>
                </button>
            </div>

            {/* Certificate 1: Landscape Preview */}
            <div id="certificate1" className="certificate-wrapper" ref={certificate1Ref} style={{ backgroundImage: `url('${API_BASE_URL}/images/template_1.png')` }}>
                <span className="certificate-field text-center cert-title">{certificate.type === 'diamond' ? 'Diamond Authenticity Certificate' : 'Jewelry Authenticity Certificate'}</span>
                <div className="cert-header-row">
                    <span><strong>Certificate #:</strong> {certificate.certificate_number}</span>
                    <span><strong>Date:</strong> {formatDate(certificate.date)}</span>
                </div>

                <span className="certificate-field item"><strong>Item:</strong> {certificate.item}</span>
                <span className="certificate-field length"><strong>Length:</strong> {certificate.length}</span>
                <span className="certificate-field weight">
                    <strong>{certificate.type === 'diamond' ? 'Width:' : 'Weight:'}</strong> {certificate.weight}
                </span>
                <span className="certificate-field gemstone"><strong>Gemstone:</strong> {certificate.gem_stone}</span>
                <span className="certificate-field carat"><strong>Carat Weight:</strong> {certificate.carat_weight} Ct</span>
                <span className="certificate-field color"><strong>Color:</strong> {certificate.color}</span>
                <span className="certificate-field clarity"><strong>Clarity:</strong> {certificate.clarity}</span>
                {certificate.type !== 'diamond' && (
                    <span className="certificate-field metal"><strong>Metal Purity:</strong> {certificate.metal_purity}</span>
                )}

                <img src={certificate.image_url} className="cert-image" alt="Jewelry" />
                <img src={`${API_BASE_URL}/images/VGL-HOLO.png`} className="hologram-landscape" alt="Authentic" />

            </div>

            {/* Certificate 2: Portrait Preview */}
            <div id="certificate2" className="certificate-wrapper" ref={certificate2Ref} style={{ backgroundImage: `url('${backgroundPath2}')` }}>
                <div className="content-overlay">
                    <div className="text-paragraphs">
                        <p>We proudly certify that this jewellery piece <strong> {certificate.item}</strong> is 
                            {certificate.type !== 'diamond' && (
                                <>
                                    crafted from <strong> {certificate.metal_purity}</strong> and 
                                </>
                            )}
                            adorned with genuine <strong> {certificate.gem_stone}</strong>.
                        </p>

                        <p>The main gemstone weighs <strong> {certificate.carat_weight}</strong> carats, featuring a
                            <strong> {certificate.color}</strong> colour and
                            <strong> {certificate.clarity}</strong> clarity, ensuring unmatched brilliance and beauty.
                            {certificate.type === 'diamond' && (
                                <>
                                    <br />The diamond has a width of <strong> {certificate.weight}</strong>.
                                </>
                            )}
                        </p>
                        <p>This certificate guarantees the <strong> Authenticity </strong> and
                            <strong> Superior quality </strong>
                            of all
                            materials employed. verified by a <strong>Certified Gemologist</strong>.</p>
                        <p> <strong style={{ color: 'red' }}>Our Promise : </strong>All Our diamonds are <strong>100% Conflict-free</strong>and<strong>ethically sourced</strong>, crafted with integrityand sustainability.</p>
                        <p className='notice' > *** ELECTRONIC COPY - DO NOT RELY SOLELY ON THIS DOCUMENT ***</p>
                    </div>
                    <img src={`${API_BASE_URL}/images/VGL-HOLO.png`} className="hologram-portrait" alt="Authentic" /><br />
                    <div className="details-block">
                        Name: <strong> {certificate.certifier_name || 'Valued Customer'}</strong><br />
                        Certificate No: <strong>{certificate.certificate_number}</strong><br />
                        Date: <strong>{formatDate(certificate.date)}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateDownload;