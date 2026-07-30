import axios from 'axios';

// የባክ-ኤንድ አድራሻ (Base URL)
const API_URL = 'http://localhost:5000/api/leads';

/**
 * ሁሉንም ሊዶች ከዳታቤዝ ለማምጣት
 */
export const getAllLeads = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("መረጃ ማምጣት አልተቻለም:", error);
        throw error;
    }
};

/**
 * አዲስ ሊድ ለመመዝገብ
 */
export const createLead = async (leadData) => {
    try {
        // በ leadRoutes.js መሰረት አድራሻው በቀጥታ API_URL ሊሆን ይችላል
        // (ማሳሰቢያ፡ በሰርቨርህ ላይ 'router.post("/", createLead)' ካልህ '/add' አያስፈልገውም)
        const response = await axios.post(API_URL, leadData);
        return response.data;
    } catch (error) {
        console.error("መመዝገብ አልተቻለም:", error);
        throw error;
    }
};

/**
 * አንድን ሊድ በ ID ለመሰረዝ
 */
export const deleteLead = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("መሰረዝ አልተቻለም:", error);
        throw error;
    }
};

/**
 * የሊድ መረጃን ለማሻሻል (Update)
 */
export const updateLead = async (id, updatedData) => {
    try {
        // በባክ-ኤንድ 'router.put' ስለተጠቀምን እዚህም 'put' መጠቀም ይመረጣል
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("ማሻሻል አልተቻለም:", error);
        throw error;
    }
};