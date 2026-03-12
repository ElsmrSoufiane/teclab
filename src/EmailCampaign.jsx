// src/components/admin/EmailCampaign.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Send as SendIcon,
  Email as EmailIcon,
  Preview as PreviewIcon,
  Code as CodeIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const EmailCampaign = () => {
  // State
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);
  
  // Form state
  const [campaign, setCampaign] = useState({
    subject: '',
    body: '',
    type: 'notification',
    target: 'all',
    minOrders: 1,
    testEmail: '',
  });

  // Preview state
  const [previewMode, setPreviewMode] = useState(false); // false = rendered HTML, true = raw HTML
  const [previewData, setPreviewData] = useState({
    customer_name: 'Client Test',
    customer_email: 'client@test.com',
    date: new Date().toLocaleDateString('fr-FR'),
    year: new Date().getFullYear(),
  });

  // Load customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/customers?per_page=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data.data.data || []);
    } catch (error) {
      showSnackbar('Erreur lors du chargement des clients', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
  };

  // Handle body change (for raw HTML)
  const handleBodyChange = (e) => {
    setCampaign(prev => ({ ...prev, body: e.target.value }));
  };

  // Handle template selection
  const templates = {
    welcome: {
      name: 'Bienvenue',
      subject: 'Bienvenue chez TECLAB !',
      body: `<p>Bonjour {{customer_name}},</p>
<p>Nous sommes ravis de vous accueillir chez TECLAB !</p>
<p>Découvrez notre large gamme de produits de qualité pour laboratoire.</p>
<p>En bonus de bienvenue, profitez de <strong>-10%</strong> sur votre première commande avec le code <strong>BIENVENUE10</strong>.</p>
<p>À bientôt sur notre site !</p>
<p>L'équipe TECLAB</p>`
    },
    offer: {
      name: 'Offre Spéciale',
      subject: 'Offre spéciale pour vous !',
      body: `<p>Bonjour {{customer_name}},</p>
<p>Nous avons une offre spéciale pour vous !</p>
<p>Profitez de <strong>-20%</strong> sur tous nos produits jusqu'à la fin du mois.</p>
<p>Utilisez le code <strong>PROMO20</strong> lors de votre commande.</p>
<p>Ne manquez pas cette occasion !</p>
<p>L'équipe TECLAB</p>`
    },
    newsletter: {
      name: 'Newsletter',
      subject: 'Newsletter TECLAB',
      body: `<p>Bonjour {{customer_name}},</p>
<p>Découvrez les dernières nouveautés et actualités de TECLAB.</p>
<p><strong>Nouveautés :</strong></p>
<ul>
<li>Nouveaux microscopes numériques</li>
<li>Promotions sur les consommables</li>
<li>Conseils d'experts du mois</li>
</ul>
<p>Visitez notre site pour en savoir plus !</p>
<p>L'équipe TECLAB</p>`
    },
    promotion: {
      name: 'Promotion Flash',
      subject: '⚡ Promotion Flash TECLAB',
      body: `<p>Bonjour {{customer_name}},</p>
<p><strong>Promotion flash ! ⚡</strong></p>
<p><strong>-30%</strong> sur une sélection de produits pour 48h seulement.</p>
<p>Ne manquez pas cette occasion unique !</p>
<p>Consultez notre site pour découvrir les produits en promotion.</p>
<p>L'équipe TECLAB</p>`
    },
    custom: {
      name: 'HTML Personnalisé',
      subject: 'Campagne personnalisée',
      body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TECLAB</h1>
      <h2>Bonjour {{customer_name}} !</h2>
    </div>
    <div class="content">
      <p>Ceci est un email HTML personnalisé.</p>
      <p>Vous pouvez mettre tout le code HTML que vous voulez ici.</p>
      <p>
        <a href="#" class="button">Appel à l'action</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; {{year}} TECLAB. Tous droits réservés.</p>
      <p>{{date}}</p>
    </div>
  </div>
</body>
</html>`
    }
  };

  const handleTemplateSelect = (templateKey) => {
    const template = templates[templateKey];
    setCampaign(prev => ({
      ...prev,
      subject: template.subject,
      body: template.body
    }));
    showSnackbar(`Template "${template.name}" chargé`, 'success');
  };

  // Handle customer selection
  const handleCustomerSelect = (event) => {
    const { value } = event.target;
    setSelectedCustomers(typeof value === 'string' ? value.split(',') : value);
  };

  // Send test email
  const sendTestEmail = async () => {
    if (!campaign.testEmail) {
      showSnackbar('Veuillez entrer une adresse email de test', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/admin/emails/send/test`,
        {
          subject: campaign.subject,
          body: campaign.body,
          test_email: campaign.testEmail,
          type: campaign.type
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        showSnackbar('Email de test envoyé avec succès!');
      }
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Erreur lors de l\'envoi', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Send campaign
  const sendCampaign = async () => {
    if (!campaign.subject || !campaign.body) {
      showSnackbar('Veuillez remplir le sujet et le contenu', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      let payload = {};

      switch (campaign.target) {
        case 'all':
          endpoint = '/admin/emails/send/all';
          payload = {
            subject: campaign.subject,
            body: campaign.body,
            type: campaign.type
          };
          break;
        case 'selected':
          if (selectedCustomers.length === 0) {
            showSnackbar('Veuillez sélectionner au moins un client', 'error');
            setLoading(false);
            return;
          }
          endpoint = '/admin/emails/send/selected';
          payload = {
            subject: campaign.subject,
            body: campaign.body,
            customer_ids: selectedCustomers,
            type: campaign.type
          };
          break;
        case 'active':
          endpoint = '/admin/emails/send/active';
          payload = {
            subject: campaign.subject,
            body: campaign.body,
            min_orders: campaign.minOrders,
            type: campaign.type
          };
          break;
        default:
          return;
      }

      const response = await axios.post(`${API_URL}${endpoint}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        showSnackbar(
          `Campagne envoyée! ${response.data.data.stats.sent_successfully} emails délivrés`, 
          'success'
        );
        setActiveStep(0);
        // Reset form
        setCampaign({
          subject: '',
          body: '',
          type: 'notification',
          target: 'all',
          minOrders: 1,
          testEmail: '',
        });
        setSelectedCustomers([]);
      }
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Erreur lors de l\'envoi', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Preview HTML
  const getPreviewHtml = () => {
    let html = campaign.body;
    Object.entries(previewData).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return html;
  };

  // Insert variable at cursor position
  const insertVariable = (variable) => {
    setCampaign(prev => ({ 
      ...prev, 
      body: prev.body + variable 
    }));
  };

  // Steps for stepper
  const steps = [
    {
      label: 'Détails de la campagne',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type de campagne</InputLabel>
              <Select
                name="type"
                value={campaign.type}
                onChange={handleChange}
                label="Type de campagne"
              >
                <MenuItem value="notification">📧 Notification</MenuItem>
                <MenuItem value="offer">🎉 Offre spéciale</MenuItem>
                <MenuItem value="newsletter">📰 Newsletter</MenuItem>
                <MenuItem value="promo">🏷️ Promotion</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Template</InputLabel>
              <Select
                value=""
                onChange={(e) => handleTemplateSelect(e.target.value)}
                label="Template"
              >
                {Object.entries(templates).map(([key, template]) => (
                  <MenuItem key={key} value={key}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Sujet de l'email"
              name="subject"
              value={campaign.subject}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">
                Contenu HTML de l'email
              </Typography>
              <Tooltip title={previewMode ? "Voir le rendu HTML" : "Voir le code HTML"}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={previewMode}
                      onChange={(e) => setPreviewMode(e.target.checked)}
                      icon={<CodeIcon />}
                      checkedIcon={<PreviewIcon />}
                    />
                  }
                  label={previewMode ? "Code" : "Aperçu"}
                />
              </Tooltip>
            </Box>

            {previewMode ? (
              <TextField
                multiline
                rows={20}
                fullWidth
                value={campaign.body}
                onChange={handleBodyChange}
                variant="outlined"
                placeholder="Collez votre code HTML ici..."
                InputProps={{ 
                  sx: { fontFamily: 'monospace', fontSize: '14px' }
                }}
                helperText="Vous pouvez coller n'importe quel code HTML"
              />
            ) : (
              <Paper
                sx={{
                  p: 3,
                  bgcolor: '#f5f5f5',
                  maxHeight: 500,
                  overflow: 'auto',
                  border: '1px solid #e0e0e0'
                }}
              >
                {campaign.body ? (
                  <div dangerouslySetInnerHTML={{ __html: getPreviewHtml() }} />
                ) : (
                  <Typography color="textSecondary" align="center">
                    Aucun contenu à prévisualiser
                  </Typography>
                )}
              </Paper>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Variables disponibles:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label="{{customer_name}}" 
                onClick={() => insertVariable('{{customer_name}}')}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label="{{customer_email}}" 
                onClick={() => insertVariable('{{customer_email}}')}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label="{{date}}" 
                onClick={() => insertVariable('{{date}}')}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label="{{year}}" 
                onClick={() => insertVariable('{{year}}')}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Sélection des destinataires',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Cible</InputLabel>
              <Select
                name="target"
                value={campaign.target}
                onChange={handleChange}
                label="Cible"
              >
                <MenuItem value="all">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon /> Tous les clients
                  </Box>
                </MenuItem>
                <MenuItem value="selected">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon /> Clients sélectionnés
                  </Box>
                </MenuItem>
                <MenuItem value="active">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingBagIcon /> Clients actifs (avec commandes)
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {campaign.target === 'selected' && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Sélectionner les clients</InputLabel>
                <Select
                  multiple
                  value={selectedCustomers}
                  onChange={handleCustomerSelect}
                  input={<OutlinedInput label="Sélectionner les clients" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const customer = customers.find(c => c.id === value);
                        return (
                          <Chip 
                            key={value} 
                            label={customer?.name || value}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                          {customer.name?.charAt(0) || '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{customer.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {campaign.target === 'active' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Nombre minimum de commandes"
                name="minOrders"
                value={campaign.minOrders}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1 } }}
                helperText="Envoyer uniquement aux clients ayant au moins ce nombre de commandes"
              />
            </Grid>
          )}
        </Grid>
      )
    },
    {
      label: 'Test & Envoi',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Email de test
            </Typography>
            <TextField
              fullWidth
              label="Adresse email de test"
              name="testEmail"
              value={campaign.testEmail}
              onChange={handleChange}
              placeholder="test@example.com"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={sendTestEmail}
              disabled={loading || !campaign.testEmail}
              fullWidth
            >
              Envoyer un test
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Récapitulatif
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Sujet:</Typography>
              <Typography variant="body2" gutterBottom>
                {campaign.subject || 'Non défini'}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Type:</Typography>
              <Typography variant="body2" gutterBottom>
                {campaign.type}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Cible:</Typography>
              <Typography variant="body2">
                {campaign.target === 'all' && 'Tous les clients'}
                {campaign.target === 'selected' && `${selectedCustomers.length} client(s) sélectionné(s)`}
                {campaign.target === 'active' && `Clients avec ≥ ${campaign.minOrders} commande(s)`}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Campagne Email
      </Typography>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  {step.content}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (index === steps.length - 1) {
                            sendCampaign();
                          } else {
                            setActiveStep(index + 1);
                          }
                        }}
                        disabled={loading}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Envoyer la campagne' : 'Continuer'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(index - 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Retour
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailCampaign; 