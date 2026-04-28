import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
// import { useData } from '../contexts/DataContext';
import { Button } from './Button';
import { Input } from './Input';
import { toast } from 'sonner';
import axios from 'axios';
import { useEffect } from 'react';

interface CertificateFormProps {
  onSuccess: () => void;
  editingCertificate?: any;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const CertificateForm: React.FC<CertificateFormProps> = ({ onSuccess, editingCertificate }) => {
  // const { addCertificate, updateCertificate } = useData();
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/stores`)
      .then(res => setStores(res.data))
      .catch(() => setStores([]));
  }, []);

  useEffect(() => {
    if (!editingCertificate) {
      axios.get(`${API_BASE_URL}/api/certificates/next-number`)
        .then(res => {
          setFormData(prev => ({
            ...prev,
            certificate_number: res.data.certificate_number
          }));
        });
    }
  }, [editingCertificate]);

  const [imagePreview, setImagePreview] = useState<string>(
    editingCertificate?.image
      ? `${API_BASE_URL}/${editingCertificate.image}`
      : ''
  );
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    certificate_number: editingCertificate?.certificate_number || '',
    type: editingCertificate?.type || 'jewellery',
    certifier_name: editingCertificate?.certifier_name || '',
    store: editingCertificate?.store || '',
    image: null as File | null,
    title: editingCertificate?.title || '',
    date: editingCertificate?.date || new Date().toISOString().split('T')[0],
    item: editingCertificate?.item || '',
    length: editingCertificate?.length || '',
    weight: editingCertificate?.weight || '',
    carat_weight: editingCertificate?.carat_weight || '',
    gem_stone: editingCertificate?.gem_stone || '',
    color: editingCertificate?.color || '',
    clarity: editingCertificate?.clarity || '',
    metal_purity: editingCertificate?.metal_purity || '',
    value: editingCertificate?.value || '',
  });

  const [/* errors */, setErrors] = useState<{ [key: string]: string }>({});
  const [/* serverError */, setServerError] = useState<string>('');
  const [/* success */, setSuccess] = useState<string>('');

  const requiredFields = [
    'certificate_number',
    'type',
    'certifier_name',
    'store',
    'image',
    'title',
    'date',
    'item',
    'length',
    'weight',
    'carat_weight',
    'gem_stone',
    'color',
    'clarity',
  ];

  // metal_purity is required only for jewellery type

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    let fieldsToCheck = [...requiredFields];

    if (editingCertificate) {
      fieldsToCheck = fieldsToCheck.filter(field => field !== 'image');
    }

    // Add metal_purity to required fields only if type is jewellery
    if (formData.type === 'jewellery') {
      fieldsToCheck.push('metal_purity');
    }

    fieldsToCheck.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required.';
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setSuccess('');
    
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill all required fields correctly.');
      return;
    }
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image') {
          if (formData.image instanceof File) {
            data.append('image', formData.image);
          }
        } else if (value !== null && value !== '') {
          data.append(key, value as any);
        }
      });

      let res;
      if (editingCertificate) {
        // PUT for update
        res = await axios.post(
          `${API_BASE_URL}/api/certificates/${editingCertificate.id}?_method=PUT`,
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setSuccess('Certificate updated successfully!');
      } else {
        // POST for create
        res = await axios.post(
          `${API_BASE_URL}/api/certificates`,
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setSuccess('Certificate created successfully!');
        setFormData({
          certificate_number: '',
          type: 'jewellery',
          certifier_name: '',
          store: '',
          image: null,
          title: '',
          date: '',
          item: '',
          length: '',
          weight: '',
          carat_weight: '',
          gem_stone: '',
          color: '',
          clarity: '',
          metal_purity: '',
          value: '',
        });
        setImagePreview('');
      }
      toast.success(editingCertificate ? 'Certificate updated successfully!' : 'Certificate created successfully!');
      onSuccess();
    } catch (err: any) {
      console.error('Error creating certificate:', err);
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        setErrors(errors || {});
        if (errors) {
          const firstErrorKey = Object.keys(errors)[0];
          const errorMessage = errors[firstErrorKey][0];
          toast.error(errorMessage);
        } else {
          toast.error('Validation error. Please check your inputs.');
        }
      } else if (err.response && err.response.status === 500) {
        setServerError('Server error. Please try again later.');
        toast.error('Server error occurred. Please try again.');
      } else {
        setServerError('An error occurred. Please try again.');
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      {/* <Input
        label="Certificate Number"
        value={formData.certificate_number}
        placeholder="e.g., VGL-A12345"
        onChange={e => setFormData({ ...formData, certificate_number: e.target.value })}

      /> */}

      <Input
        label="Certificate Number"
        value={formData.certificate_number}
        readOnly={!editingCertificate}
        className={editingCertificate ? '' : 'bg-gray-100 cursor-not-allowed'}
        onChange={(e) => {
          if (editingCertificate) {
            setFormData({ ...formData, certificate_number: e.target.value });
          }
        }}
      />

      {editingCertificate && (
        <button
          type="button"
          className="text-blue-600 underline text-sm"
          onClick={() => {
            if (window.confirm("Are you sure you want to change the certificate number?")) {
              const inputElem = document.querySelector("#cert-number-input") as HTMLInputElement;
              if (inputElem) inputElem.removeAttribute("readonly");
              toast.info("Now you can edit the certificate number.");
            }
          }}
        >
          Edit Certificate Number
        </button>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certificate Type <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors duration-300 bg-white"
          value={formData.type}
          onChange={e => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="jewellery">Jewellery Certificate</option>
          <option value="diamond">Diamond Certificate</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {formData.type === 'diamond' 
            ? 'For diamond certificates, weight will be displayed as width and metal purity will be hidden' 
            : 'For jewellery certificates, all fields including metal purity will be displayed'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Certifier Name"
          placeholder="e.g., Jhon Doe"
          value={formData.certifier_name}
          onChange={e => setFormData({ ...formData, certifier_name: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store <span className="text-red-500">*</span></label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors duration-300 bg-white"
            value={formData.store}
            onChange={e => setFormData({ ...formData, store: e.target.value })}
          >
            <option value="">Select a store</option>
            {stores.map((store: any) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
          {/* {errors.store && <p className="text-red-500 text-xs mt-1">{errors.store}</p>} */}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Jewelry Image <span className="text-red-500">*</span></label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setFormData({ ...formData, image: null });
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">Upload jewelry image</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer text-amber-600 hover:text-amber-700 font-medium">
                Choose file
              </label>
            </div>
          )}
        </div>
      </div>

      <Input
        label="Title"

        placeholder="e.g., Diamond Engagement Ring"
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Date"
          type="date"

          value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
        />
        <Input
          label="Item"

          placeholder="e.g., Engagement Ring"
          value={formData.item}
          onChange={e => setFormData({ ...formData, item: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Input
          label="Length"

          placeholder="e.g., 18 inches"
          value={formData.length}
          onChange={e => setFormData({ ...formData, length: e.target.value })}
        />
        <Input
          label={formData.type === 'diamond' ? 'Width' : 'Weight'}

          placeholder={formData.type === 'diamond' ? 'e.g., 5mm' : 'e.g., 4.5g'}
          value={formData.weight}
          onChange={e => setFormData({ ...formData, weight: e.target.value })}
        />
        <Input
          label="Carat Weight"
          type="number"

          placeholder="e.g., 2.5"
          value={formData.carat_weight}
          onChange={e => setFormData({ ...formData, carat_weight: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Gem Stone"

          placeholder="e.g., Diamond"
          value={formData.gem_stone}
          onChange={e => setFormData({ ...formData, gem_stone: e.target.value })}
        />
        <Input
          label="Color"

          placeholder="e.g., D (Colorless)"
          value={formData.color}
          onChange={e => setFormData({ ...formData, color: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Clarity"

          placeholder="e.g., VVS1"
          value={formData.clarity}
          onChange={e => setFormData({ ...formData, clarity: e.target.value })}
        />
        {formData.type === 'jewellery' && (
          <Input
            label="Metal Purity"

            placeholder="e.g., 24K Gold"
            value={formData.metal_purity}
            onChange={e => setFormData({ ...formData, metal_purity: e.target.value })}
          />
        )}
      </div>

      <Input
        label="Product Value"
        type="number"

        placeholder="e.g., 1500.00"
        value={formData.value}
        onChange={e => setFormData({ ...formData, value: e.target.value })}
      />

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" className='rounded-lg' variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className='rounded-lg'>
          {editingCertificate ? 'Update Certificate' : 'Create Certificate'}
        </Button>
      </div>
    </form>

  );
};